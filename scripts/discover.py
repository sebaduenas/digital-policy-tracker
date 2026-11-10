#!/usr/bin/env python3
"""Descubrimiento de normas candidatas.

Por cada país del tracker lanza dos búsquedas en el RSS de Google Noticias
(una por grupo de áreas), filtra los titulares que mezclan una señal
normativa con un término de área, descarta lo que ya tiene ficha y acumula
el resto en content/_candidates.json para revisión humana. No crea fichas.

Uso:
    pnpm discover [--country CC] [--days N] [--limit N] [--delay SEG] [--dry]
    python3 scripts/discover.py --selftest     (sin red, valida parseo y filtros)

El campo country es el país que se consultó, no una verificación: Google
Noticias mezcla algo de prensa vecina y hay que confirmar a mano. Con
--days 3650 sirve también para barrer hacia atrás y buscar vacíos viejos.

El archivo de salida es acumulativo: si marcas a mano el status de un
candidato ("descartado", "fichado"), las corridas siguientes lo respetan y
no lo vuelven a proponer.

Solo biblioteca estándar, para que corra en un clon limpio sin instalar nada.

ponytail: Google Noticias es la única fuente. Los boletines oficiales de la
región no publican RSS usable (probados el DOF mexicano, el Boletín Oficial
argentino, el Senado colombiano y el Congreso peruano: 403, 404, certificado
SSL inválido y timeout). Si más adelante hace falta precisión de fuente
oficial, el siguiente paso son las APIs de datos abiertos del Senado de
Brasil y de la Cámara de Chile, que sí responden pero traen cada una su
propio formato y necesitan su propio parser.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REG_DIR = ROOT / "content" / "regulations"
OUT_PATH = ROOT / "content" / "_candidates.json"

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/130.0 Safari/537.36"
)

COUNTRIES = {
    "ar": ("es-419", "es"),
    "bo": ("es-419", "es"),
    "br": ("pt-BR", "pt"),
    "cl": ("es-419", "es"),
    "co": ("es-419", "es"),
    "cr": ("es-419", "es"),
    "cu": ("es-419", "es"),
    "do": ("es-419", "es"),
    "ec": ("es-419", "es"),
    "gt": ("es-419", "es"),
    "hn": ("es-419", "es"),
    "ht": ("fr", "fr"),
    "mx": ("es-419", "es"),
    "ni": ("es-419", "es"),
    "pa": ("es-419", "es"),
    "pe": ("es-419", "es"),
    "py": ("es-419", "es"),
    "sv": ("es-419", "es"),
    "uy": ("es-419", "es"),
    "ve": ("es-419", "es"),
}

# El primer nombre entra en la consulta; todos sirven para descartar noticias
# de otro país, porque el parámetro gl de Google Noticias filtra poco.
COUNTRY_NAMES = {
    "ar": ["Argentina", "argentino"],
    "bo": ["Bolivia", "boliviano"],
    "br": ["Brasil", "brasileiro"],
    "cl": ["Chile", "chileno"],
    "co": ["Colombia", "colombiano"],
    "cr": ["Costa Rica", "costarricense"],
    "cu": ["Cuba", "cubano"],
    "do": ["Republica Dominicana", "dominicano"],
    "ec": ["Ecuador", "ecuatoriano"],
    "gt": ["Guatemala", "guatemalteco"],
    "hn": ["Honduras", "hondureno"],
    "ht": ["Haiti", "haitien"],
    "mx": ["Mexico", "mexicano"],
    "ni": ["Nicaragua", "nicaraguense"],
    "pa": ["Panama", "panameno"],
    "pe": ["Peru", "peruano"],
    "py": ["Paraguay", "paraguayo"],
    "sv": ["El Salvador", "salvadoreno"],
    "uy": ["Uruguay", "uruguayo"],
    "ve": ["Venezuela", "venezolano"],
}

# Fuera de la región, pero copan los resultados en español.
FOREIGN = [
    "espana", "union europea", "parlamento europeo", "estados unidos",
    "california", "texas", "china",
]

# Primer término de cada área va a la consulta; todos sirven para etiquetar.
AREA_TERMS = {
    "es": {
        "ia": ["inteligencia artificial", "sistemas algoritmicos", "deepfake"],
        "pdp": ["datos personales", "proteccion de datos", "privacidad"],
        "ciberseguridad": ["ciberseguridad", "delitos informaticos", "ciberataque"],
        "propiedad-intelectual": ["derecho de autor", "propiedad intelectual"],
        "plataformas": ["plataformas digitales", "redes sociales", "moderacion de contenidos"],
        "fintech": ["fintech", "criptoactivos", "criptomonedas", "finanzas abiertas"],
        "telecom": ["telecomunicaciones", "neutralidad de la red", "espectro radioelectrico"],
        "soberania": ["soberania digital", "localizacion de datos", "transferencia internacional de datos"],
        "identidad-digital": ["identidad digital", "firma electronica", "gobierno digital"],
        "menores-online": ["verificacion de edad", "menores en linea", "ninos en internet"],
    },
    "pt": {
        "ia": ["inteligencia artificial", "sistemas algoritmicos", "deepfake"],
        "pdp": ["dados pessoais", "protecao de dados", "privacidade"],
        "ciberseguridad": ["ciberseguranca", "crimes ciberneticos", "ciberataque"],
        "propiedad-intelectual": ["direito autoral", "propriedade intelectual"],
        "plataformas": ["plataformas digitais", "redes sociais", "moderacao de conteudo"],
        "fintech": ["fintech", "criptoativos", "criptomoedas", "open finance"],
        "telecom": ["telecomunicacoes", "neutralidade da rede", "espectro"],
        "soberania": ["soberania digital", "localizacao de dados", "transferencia internacional de dados"],
        "identidad-digital": ["identidade digital", "assinatura eletronica", "governo digital"],
        "menores-online": ["verificacao de idade", "menores online", "criancas na internet"],
    },
    "fr": {
        "ia": ["intelligence artificielle", "systemes algorithmiques", "deepfake"],
        "pdp": ["donnees personnelles", "protection des donnees", "vie privee"],
        "ciberseguridad": ["cybersecurite", "cybercriminalite", "cyberattaque"],
        "propiedad-intelectual": ["droit d'auteur", "propriete intellectuelle"],
        "plataformas": ["plateformes numeriques", "reseaux sociaux", "moderation des contenus"],
        "fintech": ["fintech", "cryptoactifs", "cryptomonnaies"],
        "telecom": ["telecommunications", "neutralite du net", "spectre"],
        "soberania": ["souverainete numerique", "localisation des donnees"],
        "identidad-digital": ["identite numerique", "signature electronique", "gouvernement numerique"],
        "menores-online": ["verification de l'age", "mineurs en ligne"],
    },
}

# Señales de que el titular habla de una norma y no de tecnología en general.
SIGNALS = {
    "es": ["ley", "proyecto de ley", "decreto", "reglamento", "regula", "normativa",
           "congreso", "senado", "camara de diputados", "promulg", "aprueba", "sanciona"],
    "pt": ["lei", "projeto de lei", "decreto", "regulamento", "regula", "congresso",
           "senado", "camara dos deputados", "sancion", "aprova", "medida provisoria"],
    "fr": ["loi", "projet de loi", "decret", "reglement", "regule", "parlement",
           "senat", "assemblee nationale", "adopte", "promulg"],
}

# Dos grupos para no exceder lo que Google Noticias devuelve por consulta.
GROUPS = [
    ["ia", "pdp", "ciberseguridad", "plataformas", "fintech"],
    ["telecom", "identidad-digital", "propiedad-intelectual", "soberania", "menores-online"],
]

ENTITIES = [
    ("&lt;", "<"), ("&gt;", ">"), ("&quot;", '"'),
    ("&#39;", "'"), ("&apos;", "'"), ("&nbsp;", " "), ("&amp;", "&"),
]


def normalize(s: str) -> str:
    """Minúsculas, sin tildes y con los espacios colapsados."""
    nfd = unicodedata.normalize("NFD", s.lower())
    sin_tildes = "".join(c for c in nfd if not unicodedata.combining(c))
    return " ".join(sin_tildes.split())


def decode_entities(s: str) -> str:
    s = re.sub(r"<!\[CDATA\[(.*?)\]\]>", r"\1", s, flags=re.S)
    for entidad, char in ENTITIES:
        s = s.replace(entidad, char)
    return s


def parse_feed(xml: str) -> list[dict]:
    items = []
    for raw in re.findall(r"<item>.*?</item>", xml, re.S):
        def pick(tag: str) -> str:
            m = re.search(rf"<{tag}[^>]*>(.*?)</{tag}>", raw, re.S)
            return decode_entities(m.group(1)).strip() if m else ""

        title, url = pick("title"), pick("link")
        if not title or not url:
            continue
        outlet = pick("source")
        # Google Noticias repite el medio al final del titular.
        if outlet and title.endswith(f" - {outlet}"):
            title = title[: -(len(outlet) + 3)].strip()
        items.append({
            "title": title,
            "url": url,
            "published_at": pick("pubDate"),
            "outlet": outlet,
        })
    return items


def tag_areas(title: str, lang: str) -> list[str]:
    n = normalize(title)
    return [
        area for area, terms in AREA_TERMS[lang].items()
        if any(normalize(t) in n for t in terms)
    ]


def has_signal(title: str, lang: str) -> bool:
    n = normalize(title)
    return any(w in n for w in SIGNALS[lang])


def is_elsewhere(title: str, cc: str) -> bool:
    """Descarta la noticia que nombra otro país o una potencia de fuera."""
    n = normalize(title)
    propios = [normalize(x) for x in COUNTRY_NAMES[cc]]
    if any(f in n for f in FOREIGN):
        return True
    for otro, nombres in COUNTRY_NAMES.items():
        if otro == cc:
            continue
        for nombre in nombres:
            t = normalize(nombre)
            if t in n and not any(t in p or p in t for p in propios):
                return True
    return False


def parse_date(raw: str):
    if not raw:
        return None
    try:
        return parsedate_to_datetime(raw)
    except (TypeError, ValueError):
        return None


def is_stale(published_at: str, days: int, now: datetime) -> bool:
    """Google Noticias ignora su propio operador when:, así que se filtra acá."""
    fecha = parse_date(published_at)
    if fecha is None:
        return False
    return fecha < now - timedelta(days=days)


def existing_titles() -> dict[str, list[str]]:
    """Títulos cortos y alias de las fichas existentes, por país.

    Lee el frontmatter con expresiones regulares en vez de un parser YAML
    para no sumar dependencias: solo hacen falta tres campos planos.
    """
    por_pais: dict[str, list[str]] = {}
    for archivo in sorted(REG_DIR.rglob("*.mdx")):
        texto = archivo.read_text(encoding="utf-8")
        m = re.match(r"---\n(.*?)\n---", texto, re.S)
        if not m:
            continue
        fm = m.group(1)
        pais = re.search(r"^country:\s*\"?([A-Za-z]{2})\"?\s*$", fm, re.M)
        if not pais:
            continue
        nombres = []
        corto = re.search(r"^shortTitle:\s*\"?(.*?)\"?\s*$", fm, re.M)
        if corto:
            nombres.append(corto.group(1))
        alias = re.search(r"^aliases:\n((?:\s+-\s.*\n)+)", fm, re.M)
        if alias:
            nombres += re.findall(r"^\s+-\s+\"?(.*?)\"?\s*$", alias.group(1), re.M)
        validos = [normalize(x) for x in nombres if len(normalize(x)) >= 10]
        por_pais.setdefault(pais.group(1).lower(), []).extend(validos)
    return por_pais


def is_covered(title: str, known: list[str]) -> bool:
    n = normalize(title)
    return any(k in n for k in known)


def candidate_id(country: str, title: str) -> str:
    clave = f"{country}:{normalize(title)}".encode("utf-8")
    return hashlib.sha1(clave).hexdigest()[:12]


def build_query(group: list[str], lang: str, days: int, cc: str) -> str:
    def quote(t: str) -> str:
        return f'"{t}"' if " " in t else t

    areas = " OR ".join(quote(AREA_TERMS[lang][a][0]) for a in group)
    norms = " OR ".join(quote(s) for s in SIGNALS[lang][:5])
    place = " OR ".join(quote(n) for n in COUNTRY_NAMES[cc])
    return f"({norms}) ({areas}) ({place}) when:{days}d"


def fetch_feed(query: str, cc: str) -> list[dict]:
    hl = COUNTRIES[cc][0]
    gl = cc.upper()
    params = urllib.parse.urlencode({
        "q": query, "hl": hl, "gl": gl, "ceid": f"{gl}:{hl}",
    })
    req = urllib.request.Request(
        f"https://news.google.com/rss/search?{params}",
        headers={"User-Agent": UA},
    )
    with urllib.request.urlopen(req, timeout=30) as res:
        return parse_feed(res.read().decode("utf-8", "replace"))


def selftest() -> None:
    xml = (
        "<rss><channel><item><title>Senado aprueba el proyecto de ley de datos "
        "personales - El Mercurio</title>"
        "<link>https://news.google.com/rss/articles/ABC</link>"
        "<pubDate>Mon, 03 Nov 2026 10:00:00 GMT</pubDate>"
        '<source url="https://emol.com">El Mercurio</source></item>'
        "<item><title>Sin enlace</title></item></channel></rss>"
    )
    items = parse_feed(xml)
    assert len(items) == 1, "debe descartar el item sin enlace"
    assert items[0]["outlet"] == "El Mercurio", "debe leer el medio"
    assert items[0]["title"] == "Senado aprueba el proyecto de ley de datos personales", (
        f"debe recortar el medio del titular, quedó: {items[0]['title']}"
    )

    assert decode_entities('Ley &amp; datos &quot;x&quot;') == 'Ley & datos "x"', "entidades"
    assert normalize("Protección DE  Datos") == "proteccion de datos", "normalize"

    assert tag_areas("Nueva ley de inteligencia artificial y datos personales", "es") == [
        "ia", "pdp"
    ], "debe etiquetar dos áreas"
    assert tag_areas("Receta de empanadas", "es") == [], "sin áreas"
    assert tag_areas("Projeto regula dados pessoais", "pt") == ["pdp"], "términos en portugués"

    t0 = datetime(2026, 11, 9, tzinfo=timezone.utc)
    assert is_stale("Mon, 03 Nov 2025 10:00:00 GMT", 30, t0), "nota vieja"
    assert not is_stale("Mon, 03 Nov 2026 10:00:00 GMT", 30, t0), "nota reciente"
    assert not is_stale("", 30, t0), "sin fecha no se descarta"
    assert not is_stale("fecha rara", 30, t0), "fecha ilegible no se descarta"

    assert has_signal("Congreso discute el proyecto", "es"), "señal normativa"
    assert not has_signal("Empresa lanza chatbot", "es"), "sin señal normativa"

    known = [normalize("Ley de Protección de Datos Personales")]
    assert is_covered("Reglamento de la Ley de Protección de Datos Personales", known), "cubierto"
    assert not is_covered("Proyecto de ley de ciberseguridad", known), "no cubierto"

    assert candidate_id("cl", "Ley X") == candidate_id("cl", "ley  x"), (
        "el id ignora mayúsculas y espacios"
    )
    assert candidate_id("cl", "Ley X") != candidate_id("pe", "Ley X"), "el id separa países"
    # El mismo id que generaba la versión en TypeScript, para no duplicar lo ya revisado.
    assert candidate_id("cl", "Ley de datos") == "1fb9f256d524", "id estable"

    assert is_elsewhere("Congreso de Guatemala aprueba ley de ciberseguridad", "cl"), "otro país"
    assert is_elsewhere("La UE prepara una ley para España", "cl"), "fuera de la región"
    assert not is_elsewhere("Senado chileno aprueba la ley de datos", "cl"), "país propio"
    assert not is_elsewhere("Diputados aprueban la ley de ciberseguridad", "cl"), "sin país nombrado"
    assert not is_elsewhere("Costa Rica regula la IA", "cr"), "nombre compuesto propio"

    q = build_query(["ia", "pdp"], "es", 30, "cl")
    esperada = (
        '(ley OR "proyecto de ley" OR decreto OR reglamento OR regula) '
        '("inteligencia artificial" OR "datos personales") (Chile OR chileno) when:30d'
    )
    assert q == esperada, f"consulta inesperada: {q}"

    print("selftest OK")


def main() -> int:
    ap = argparse.ArgumentParser(description="Descubre normas candidatas por país.")
    ap.add_argument("--country", help="código de dos letras, ej. cl")
    ap.add_argument("--days", type=int, default=30)
    ap.add_argument("--limit", type=int, help="titulares por consulta")
    ap.add_argument("--delay", type=float, default=3.5, help="segundos entre consultas")
    ap.add_argument("--dry", action="store_true", help="no escribe el archivo")
    ap.add_argument("--selftest", action="store_true")
    args = ap.parse_args()

    if args.selftest:
        selftest()
        return 0

    countries = [args.country.lower()] if args.country else list(COUNTRIES)
    for cc in countries:
        if cc not in COUNTRIES:
            ap.error(f"país desconocido: {cc}")

    known = existing_titles()
    previos = []
    if OUT_PATH.exists():
        previos = json.loads(OUT_PATH.read_text(encoding="utf-8"))["candidates"]
    por_id = {c["id"]: c for c in previos}
    ahora = datetime.now(timezone.utc)
    ahora_iso = ahora.isoformat().replace("+00:00", "Z")

    agregados = 0
    vacias = 0
    for cc in countries:
        lang = COUNTRIES[cc][1]
        vistos = nuevos = 0
        for group in GROUPS:
            query = build_query(group, lang, args.days, cc)
            try:
                items = fetch_feed(query, cc)
            except (urllib.error.URLError, TimeoutError, OSError) as err:
                print(f"  {cc}: falló la consulta ({err})", file=sys.stderr)
                continue
            if not items:
                vacias += 1
            vistos += len(items)
            for item in items[: args.limit] if args.limit else items:
                areas = tag_areas(item["title"], lang)
                if not areas or not has_signal(item["title"], lang):
                    continue
                if is_elsewhere(item["title"], cc):
                    continue
                if is_stale(item["published_at"], args.days, ahora):
                    continue
                if is_covered(item["title"], known.get(cc, [])):
                    continue
                cid = candidate_id(cc, item["title"])
                if cid in por_id:
                    continue
                fecha = parse_date(item["published_at"]) or ahora
                por_id[cid] = {
                    "id": cid,
                    # País, área principal y mes. Agrupa las muchas notas de
                    # prensa sobre una misma norma sin fusionarlas, para
                    # revisarlas de una pasada.
                    "cluster": f"{cc}-{areas[0]}-{fecha:%Y-%m}",
                    "country": cc.upper(),
                    "areas": areas,
                    "title": item["title"],
                    "outlet": item["outlet"],
                    "url": item["url"],
                    "publishedAt": fecha.astimezone(timezone.utc)
                    .isoformat()
                    .replace("+00:00", "Z"),
                    "firstSeenAt": ahora_iso,
                    "status": "nuevo",
                }
                nuevos += 1
                agregados += 1
            time.sleep(args.delay)
        print(f"{cc}: {vistos} titulares, {nuevos} candidatos nuevos")

    if vacias:
        print(
            f"\n{vacias} consultas volvieron vacías. Google Noticias limita las "
            "ráfagas: si son muchas, repetir con --delay 8",
            file=sys.stderr,
        )

    # Fecha descendente dentro de cada cluster, aprovechando que sorted es estable.
    candidates = sorted(por_id.values(), key=lambda c: c["publishedAt"], reverse=True)
    candidates.sort(key=lambda c: c["cluster"])
    pendientes = sum(1 for c in candidates if c["status"] == "nuevo")
    print(f"\n{agregados} nuevos, {len(candidates)} en total, {pendientes} por revisar")

    por_cluster: dict[str, int] = {}
    for c in candidates:
        if c["status"] == "nuevo":
            por_cluster[c["cluster"]] = por_cluster.get(c["cluster"], 0) + 1
    for cluster, n in sorted(por_cluster.items(), key=lambda kv: -kv[1])[:15]:
        print(f"  {cluster}: {n}")

    if args.dry:
        return 0
    OUT_PATH.write_text(
        json.dumps({"updatedAt": ahora_iso, "candidates": candidates},
                   indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"-> {OUT_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
