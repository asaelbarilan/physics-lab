# Focused reuse decision — 2026-09-14

Nine resources considered; eight inspected beyond search extracts. Scope is the two starting modules, not a comprehensive literature review.

| Resource | What exists | Decision |
|---|---|---|
| [S1: ViewSpace / NASA: Eagle Nebula](https://viewspace.org/interactives/unveiling_invisible_universe/star_formation/eagle_nebula) | Interactive observations at different wavelengths, not a cloud mass/density collapse model. | Link as optional enrichment; Hebrew interface and requested controls are absent. |
| [S2: MySimulator: Jeans Instability](https://www.mysimulator.uk/space/galaxy-formation-physics/) | Author advertises mass, radius, temperature, Jeans threshold and free-fall time. | Direct conceptual match; full page retrieval failed twice, license and equations could not be verified. Do not copy. |
| [S3: David Greenheck: WebGPU Black Hole](https://github.com/dgreenheck/webgpu-black-hole) | README, shader source and LICENSE inspected: renderer uses physically-inspired raymarching and disk shading. | MIT code available, but renderer is for appearance/lensing, not stellar collapse. Link as optional exploration; retain for future lensing module. |
| [S4: Illinois: Stellar Structure and Evolution](https://rainman.astro.illinois.edu/ddr/stellar/advanced.html) | Form accepts stellar mass and metallicity and evolves existing stars. | Useful future stellar evolution/H–R reference; no mass-density cloud controls. Runtime and reuse license not verified. |
| [P1: OpenStax Astronomy 2e 21.1](https://openstax.org/books/astronomy-2e/pages/21-1-star-formation) | Cold dense cloud cores can collapse; a protostar precedes sustained hydrogen fusion. | Basis for stages and explanatory copy; no imported artwork/code. |
| [P2: OpenStax Astronomy 2e 21.2](https://openstax.org/books/astronomy-2e/pages/21-2-the-h-r-diagram-and-the-study-of-stellar-evolution) | Gravitational contraction releases energy; later heat retention warms the protostar; contraction times depend on mass. | Stage animation must not be presented as a measured timeline or exact core temperature. |
| [P3: OpenStax Astronomy 2e 24.5](https://openstax.org/books/astronomy-2e/pages/24-5-black-holes) | Nonrotating horizon radius is 2GM/c², approximately 3 km per solar mass. | Mass-radius thought experiment. Do not imply Sun naturally forms black hole or draw a visible stellar interior after horizon formation. |
| [P4: C. Dominik: Molecular clouds lecture notes, section 2.2](https://staff.fnwi.uva.nl/c.dominik/Teaching/SPF/02-molecular-clouds.pdf) | Isothermal Jeans mass and pressureless uniform-density free-fall time; magnetic/turbulent support neglected. | Compute initial stability and a characteristic free-fall time, not the full duration to fusion. |
| [P5: NASA: Anatomy of a black hole](https://science.nasa.gov/universe/black-holes/anatomy/) | Event horizon, accretion disk and apparent shadow are distinct concepts. | Show a schematic horizon boundary, not a claim to reproduce a telescope image. |

## Decision before implementation
External embeds are not the primary teaching surface: Hebrew translation, all requested variables, access and browser reliability are not established. No candidate verified to cover both exact lessons. Adaptation of S3 is licensed but adds a GPU renderer without supplying the formation model. Therefore implement small independent teaching models using P1–P5 equations/explanations, retaining links to S1 and S3 as real existing interactive enrichment. No third-party source or media copied.

## Scope and limitations
Star module: cold molecular fragment at 10 K, mean particle mass 2.33 proton masses. Jeans linear-instability threshold, uniform sphere radius, pressureless free-fall timescale. Formation sequence is explicitly a pedagogical progression, not a hydrodynamic solver or real-time integration. No fragmentation, magnetic fields, turbulence, accretion efficiency or exact core temperature prediction. A collapsing cloud may form multiple stars in reality.
Black-hole module: idealized spherical, uncharged, nonrotating mass; independent mass and radius controls and exact Schwarzschild radius. This is a compactness thought experiment, not a core-collapse/supernova solver. No interior light is shown beyond horizon. Horizon drawn in schematic coordinates, not apparent shadow.

## Validation plan
Solar-mass radius, linear mass scaling, threshold equality and both sides, invalid-input protection; Jeans scalings with temperature/density; free-fall density scaling; stable cloud cannot advance to fusion; existing optics tests retained. Exercise feedback and hash navigation smoke checks; build and hosted asset verification.

## Search log
Queries: star formation interactive simulation protostar HTML5 mass density; black hole formation Schwarzschild radius interactive simulation open source; UNL stellar evolution license; compadre star formation; Jeans instability interactive; OpenStax star formation; university Jeans mass and free-fall time. No date cutoff; checked 2026-09-14. Followed NASA to ViewSpace and GitHub to LICENSE and shader; inspected university derivation. MySimulator full retrieval failed twice: no claim of license or runtime verification. Datasets/pretrained models not needed for deterministic teaching models. No formal benchmark review performed.

## Falsification / next topics
If a Hebrew-compatible cloud-collapse resource with explicit reusable license is found, revisit native implementation. For advanced lensing, inspect geodesic accuracy and browser support before adapting S3. Future requested catalog is planned, not implemented in this release.

The skill validator includes hard-coded full-survey quotas (15 papers, 3 benchmarks); this narrower source review is not labeled decision-grade. Its report is retained without inventing papers or benchmarks.

