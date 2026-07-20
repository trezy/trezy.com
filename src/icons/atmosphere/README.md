# Atmosphere logomarks

Monochrome logomarks for the Atmosphere (atproto) apps linked from `SocialNav`,
taken from the community set at <https://tangled.org/cozylittle.house/atmologos/>
(`bw logomarks/`, 64×64, flattened, transparent).

`rocksky.svg` is the exception to that provenance: Rocksky isn't in the atmologos
set, so this is the creator's own `icon-monochrome-64.svg` — their flattened
tray/menu-bar variant, which already ships `fill="currentColor"`. `sifa.svg` and
the rest come from atmologos.

The atmologos marks are pure black on import, so astro-icon detects them as monochrome and
rewrites every fill to `currentColor` — meaning they inherit `--muted`/`--brand`
and the palette-wide `--hue-shift` exactly like the FontAwesome brand icons do.
Keep any additions monochrome for the same reason.

`npmx-badge.svg` is the one derived file: the upstream `npmx.svg` is a bare `./`
that reads as stray punctuation next to the other marks, so the badge wraps it in
the rounded square npmx uses on their own favicon. Rounded square and mark share a
single path with `fill-rule="evenodd"`, so the dot and slash knock through and the
whole thing stays one colour. The mark is scaled 0.70 about the centre to match the
proportion npmx's favicon uses. `npmx.svg` is kept as the unmodified upstream
original in case the plain mark is ever wanted back.

Upstream states no license. They're used here nominatively, to link to Trezy's
own profile on each service.
