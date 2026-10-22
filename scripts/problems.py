"""
共用的題目 / 標籤載入模組，給 build_site.py 與 new_problem.py 使用。

資料夾結構：
    problems/<source>/<folder>/README.md   front matter + 筆記
    problems/<source>/<folder>/solution*.cpp
    tags/<slug>.md                         （選填）某個標籤的說明、模板與別名
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROBLEMS_DIR = ROOT / "problems"
TAGS_DIR = ROOT / "tags"

DIFFICULTIES = ["Easy", "Medium", "Hard", "Unrated"]

# 來源顯示名稱與排序；不在清單內的來源會排在最後、以資料夾名稱顯示
SOURCES = {
    "leetcode": "LeetCode",
    "interview": "面試題",
    "codeforces": "Codeforces",
    "misc": "其他",
}

LANG_EXT = {
    ".cpp": "C++", ".c": "C", ".py": "Python", ".java": "Java",
    ".go": "Go", ".rs": "Rust", ".js": "JavaScript", ".ts": "TypeScript",
}


# ---------------------------------------------------------------- models
@dataclass
class Tag:
    slug: str
    name: str
    summary: str = ""
    aliases: list[str] = field(default_factory=list)
    body: str = ""                  # tags/<slug>.md 的內容；沒有說明檔就是空字串
    has_file: bool = False


@dataclass
class Problem:
    source: str
    id: str
    title: str
    difficulty: str
    folder: str                     # 相對 ROOT 的路徑
    tags: list[str] = field(default_factory=list)       # tag slugs
    url: str = ""
    star: bool = False
    summary: str = ""
    date: str = ""
    has_note: bool = False
    body: str = ""                  # 筆記 markdown（不含 front matter 與標題）
    solutions: list[dict] = field(default_factory=list)  # {lang, name, path}

    @property
    def key(self) -> str:
        return re.sub(r"[^a-z0-9]+", "-", f"{self.source}-{self.id}".lower()).strip("-")

    @property
    def num(self) -> int | None:
        return int(self.id) if self.id.isdigit() else None

    @property
    def source_name(self) -> str:
        return SOURCES.get(self.source, self.source)


# ---------------------------------------------------------------- parsing
FRONT_MATTER = re.compile(r"^---\s*\n(.*?)\n---\s*(?:\n|$)", re.S)
COMMENT = re.compile(r"<!--.*?-->", re.S)


def parse_front_matter(text: str) -> tuple[dict | None, str]:
    """極簡 YAML front matter parser（key: value 與 key: [a, b]），不需安裝套件。"""
    m = FRONT_MATTER.match(text)
    if not m:
        return None, text
    meta: dict = {}
    for line in m.group(1).splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        key, _, val = line.partition(":")
        key, val = key.strip(), val.strip()
        if val.startswith("[") and val.endswith("]"):
            meta[key] = [v.strip().strip("'\"") for v in val[1:-1].split(",") if v.strip()]
        elif val.lower() in ("true", "false"):
            meta[key] = val.lower() == "true"
        else:
            meta[key] = val.strip("'\"")
    return meta, text[m.end():]


def as_list(v) -> list[str]:
    if not v:
        return []
    return v if isinstance(v, list) else [v]


def clean_body(body: str) -> str:
    """移除 HTML 註解與開頭的 # 標題（網站會另外顯示標題）。"""
    body = COMMENT.sub("", body)
    body = re.sub(r"^\s*# .*\n", "", body, count=1)
    return re.sub(r"\n{3,}", "\n\n", body).strip()


def detect_note(body: str) -> bool:
    """「思路」段落有實際內容才算寫了筆記。"""
    m = re.search(r"^##[ \t]*思路[ \t]*$(.*?)(?=^##\s|\Z)", body, re.S | re.M)
    section = m.group(1) if m else body
    return bool(section.strip())


# ---------------------------------------------------------------- loaders
def tag_slug(name: str) -> str:
    """標籤名稱 → 網址用的 slug：Hash Table → hash-table、C++ → cpp；中文保留原字。"""
    s = name.strip().lower().replace("+", "p")
    return re.sub(r"[^\w]+", "-", s).strip("-_") or "tag"


def load_tag_files() -> tuple[dict[str, Tag], list[str]]:
    """讀取 tags/*.md（選填的標籤說明檔），檔名就是 slug。"""
    tags, errors = {}, []
    if not TAGS_DIR.exists():
        return tags, errors
    for f in sorted(TAGS_DIR.glob("*.md")):
        meta, body = parse_front_matter(f.read_text(encoding="utf-8"))
        if not meta or not meta.get("name"):
            errors.append(f"{f.relative_to(ROOT)}: 缺少 front matter 的 name 欄位")
            continue
        tags[f.stem] = Tag(
            slug=f.stem,
            name=meta["name"],
            summary=meta.get("summary", ""),
            aliases=as_list(meta.get("aliases")),
            body=clean_body(body),
            has_file=True,
        )
    return tags, errors


class TagRegistry:
    """把題目裡寫的標籤統一成 slug。

    - 對得上 tags/*.md 的 name / aliases / 檔名（不分大小寫）→ 用那個檔案
    - 對不上 → 自動建立一個沒有說明的標籤；只差在大小寫、空白或連字號的寫法會合併成同一個
    """

    def __init__(self, files: dict[str, Tag]):
        self.tags: dict[str, Tag] = dict(files)
        self.errors: list[str] = []
        self.lookup: dict[str, str] = {}
        for t in files.values():
            for name in [t.slug, t.name, *t.aliases]:
                key = name.strip().lower()
                other = self.lookup.get(key)
                if other and other != t.slug:
                    self.errors.append(f"tags/: 「{name}」同時出現在 {other}.md 與 {t.slug}.md")
                    continue
                self.lookup[key] = t.slug

    def resolve(self, name: str, where: str) -> str:
        key = name.strip().lower()
        if key in self.lookup:
            return self.lookup[key]
        slug = tag_slug(name)
        if slug in self.tags:
            existing = self.tags[slug].name
            if existing != name.strip():
                self.errors.append(f"{where}: 標籤「{name}」與「{existing}」視為同一個，建議統一寫法")
        else:
            self.tags[slug] = Tag(slug=slug, name=name.strip())
        return slug


def load_problems() -> tuple[list[Problem], dict[str, Tag], list[str]]:
    """回傳（題目、所有用到或有說明檔的標籤、警告訊息）。"""
    files, file_errors = load_tag_files()
    registry = TagRegistry(files)
    problems, errors = [], []
    seen: set[str] = set()

    if not PROBLEMS_DIR.exists():
        return problems, registry.tags, file_errors + registry.errors

    for src_dir in sorted(p for p in PROBLEMS_DIR.iterdir() if p.is_dir()):
        source = src_dir.name
        for d in sorted(p for p in src_dir.iterdir() if p.is_dir()):
            where = d.relative_to(PROBLEMS_DIR).as_posix()
            note = d / "README.md"
            if not note.exists():
                errors.append(f"{where}: 缺少 README.md")
                continue
            meta, body = parse_front_matter(note.read_text(encoding="utf-8"))
            if meta is None:
                errors.append(f"{where}: README.md 沒有 front matter")
                continue

            missing = [k for k in ("id", "title", "difficulty") if not meta.get(k)]
            if missing:
                errors.append(f"{where}: 缺少欄位 {', '.join(missing)}")
                continue
            if meta["difficulty"] not in DIFFICULTIES:
                errors.append(f"{where}: difficulty 必須是 {' / '.join(DIFFICULTIES)}")
                continue

            pid = str(meta["id"]).strip()
            if source == "leetcode" and not pid.isdigit():
                errors.append(f"{where}: LeetCode 題目的 id 必須是數字")
                continue

            names = as_list(meta.get("tags"))
            if meta.get("pattern"):     # 舊格式：pattern 欄位已併入 tags
                errors.append(f"{where}: pattern 欄位已併入 tags，請把內容移到 tags")
                names += as_list(meta.get("pattern"))
            slugs = []
            for name in names:
                slug = registry.resolve(name, where)
                if slug not in slugs:
                    slugs.append(slug)

            body = clean_body(body)
            prob = Problem(
                source=source,
                id=str(int(pid)) if pid.isdigit() else pid,
                title=meta["title"],
                difficulty=meta["difficulty"],
                folder=d.relative_to(ROOT).as_posix(),
                tags=slugs,
                url=meta.get("url", ""),
                star=bool(meta.get("star")),
                summary=meta.get("summary", ""),
                date=meta.get("date", ""),
                has_note=detect_note(body),
                body=body,
                solutions=[
                    {"lang": LANG_EXT[f.suffix], "name": f.name,
                     "path": f.relative_to(ROOT).as_posix()}
                    for f in sorted(d.iterdir())
                    if f.is_file() and f.suffix in LANG_EXT
                ],
            )
            if prob.key in seen:
                errors.append(f"{where}: id 與其他題目重複（{prob.key}）")
                continue
            seen.add(prob.key)
            if not prob.solutions:
                errors.append(f"{where}: 找不到解答檔案")
            problems.append(prob)

    order = list(SOURCES)
    problems.sort(key=lambda p: (
        order.index(p.source) if p.source in order else len(order),
        p.source,
        p.num if p.num is not None else 10**9,
        p.id,
    ))
    return problems, registry.tags, file_errors + registry.errors + errors
