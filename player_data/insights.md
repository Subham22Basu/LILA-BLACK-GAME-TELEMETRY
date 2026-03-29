# Level Design Insights

### Insight 1: The Player-Bot Segregation
* **Map:** AmbroseValley | **Match ID:** 5a7b3
* **What caught my eye:** A severe geographical divide between human players and AI bots, leading to an almost entirely unpopulated western half of the map.
* **Back it up:** The telemetry shows blue dots (Human Paths) clustering almost exclusively on the eastern side near the commercial buildings. Meanwhile, orange dots (Bot Paths) wander in the western fields and stadium compound. The two groups rarely intersect.
* **Actionable Items:** Adjust the NavMesh to aggressively push bots toward high-tier loot zones where humans drop, or buff the dynamic loot spawns in the western stadium.
* **Business & Design Impact:** Level designers craft bot paths to provide players with consistent pacing. If humans never see the bots, those design goals fail, leading to stretches of "dead time" which harms player retention.

### Insight 2: The "Golden Path" Corridor
* **Map:** GrandRift | **Match ID:** 9b049
* **What caught my eye:** A highly optimized, single-file "highway" of traffic and looting that completely ignores 80% of the available map.
* **Back it up:** The heatmap reveals a blazing bright cyan trail tracking directly from the top-right "Burnt Zone" straight down into the "Mine Pit." Major Points of Interest like "Labour Quarters" and "Gas Station" have absolutely zero human traffic.
* **Actionable Items:** Break up this "Golden Path" by nerfing the loot density between the Burnt Zone and Mine Pit, and buff loot spawns at the "Labour Quarters."
* **Business & Design Impact:** Map staleness is a primary driver of player churn in extraction shooters. If every match plays out via the exact same rotation, the game loses its replayability, directly harming Battle Pass sales.

### Insight 3: The River Bridge "Camping Grounds"
* **Map:** Lockdown | **Match ID:** 7bb92
* **What caught my eye:** Highly linear player pathing forced across narrow bridges, turning the exits into massive combat "camping grounds."
* **Back it up:** The blue pathing dots show players being severely funneled across the central river crossings. Switching to the heatmap, we see dense red combat clusters parked exactly at these crossing points to gatekeep anyone forced to cross.
* **Actionable Items:** Break the camper's line of sight by adding hard cover (abandoned trucks) along the bridges, and add alternative flanking routes (shallow water fords or ziplines).
* **Business & Design Impact:** Map flow should feel fluid, not restrictive. Eliminating these forced camping spots reduces the feeling of a "cheap death," which directly protects Daily Active User retention and app store ratings.