# System Architecture & Technical Decisions

## 🛠️ Tech Stack & Rationale
* **Data Processing (Backend): Python 3, Pandas, Fastparquet.** * *Why:* `.parquet` files are heavily compressed and meant for big data. Python's Pandas library is the industry standard for efficiently opening, cleaning, and re-exporting this data. 
* **Visualization (Frontend): Vanilla HTML5, CSS3, JavaScript (ES6+).** * *Why:* To keep the tool lightweight and instantly deployable. By avoiding heavy frameworks like React or Vue, there is no build step required. The tool runs directly in the browser and handles data updates via lightning-fast DOM manipulation.

## 🌊 Data Flow Pipeline
The architecture is split into a "Bake" step and a "Render" step to ensure frontend performance:
1. **The Bake (Python):** The `process_data.py` script crawls the `player_data` directory, reads the raw `.parquet` files, decodes byte strings, flags bot accounts, and converts timestamps into high-precision floats. It globally sorts the data chronologically and exports a single, lightweight `database.json`.
2. **The Fetch (JS):** Upon load, `script.js` asynchronously fetches `database.json` and loads it into memory.
3. **The Render (JS/DOM):** When the user interacts with the timeline slider or filters, the JavaScript slices the array up to the current index and dynamically generates absolute-positioned `<div>` elements onto the map container.

## 🗺️ Mapping Game Coordinates to the Minimap
Translating the 3D game engine's spatial coordinates `(X, Y, Z)` to a 2D 1024x1024 pixel screen was the most complex technical challenge. 

* **The Approach:** I utilized a normalized UV mapping scale. Each map has a predefined `scale` (total game units across the map) and an `originX` / `originZ` (the game-world coordinate of the map's top-left corner).
* **The Math:** 1. Calculate the percentage across the map: `u = (event.x - originX) / scale`
  2. Calculate the depth percentage: `v = (event.z - originZ) / scale`
  3. Convert to pixels: Multiply by `1024px`. 
  4. *Invert the Z-Axis:* Because HTML DOM elements draw from the top-down, but game engines typically map Z from bottom-up, the vertical pixel calculation was inverted using `(1 - v) * 1024` to ensure players accurately appeared on the correct side of the map.

## 🤔 Ambiguous Data & Assumptions
* **Identifying Bots:** The data lacked a strict boolean flag for bots vs. human players. I assumed that bot accounts possessed either unusually short or strictly numeric user IDs. I wrote a Python lambda function (`len(str(x)) < 15 or str(x).isnumeric()`) to flag these so they could be filtered out during heatmapping.
* **Timestamp Collisions:** Thousands of events shared the same whole-second integer timestamp. I assumed stripping decimals would ruin chronological scrubbing, so I altered the Python parser to retain high-precision floats, allowing the timeline slider to step through micro-events smoothly.
* **Verticality (Y-Axis):** I assumed that a top-down 2D projection was sufficient for level flow insights. Vertical height data (Y-axis) was intentionally ignored in rendering to avoid visual clutter.

## ⚖️ Major Tradeoffs

| Consideration | Options Evaluated | Final Decision | Rationale |
| :--- | :--- | :--- | :--- |
| **Rendering Engine** | HTML5 `<canvas>` vs. DOM Elements (`<div>`) | **DOM Elements** | While Canvas handles millions of particles better, DOM elements allow for instant CSS prototyping (using `mix-blend-mode` for heatmaps) and easier click/hover interaction layers without writing complex redraw logic. |
| **Parquet Parsing** | Browser-side (parquet.js) vs. Python Pre-processing | **Python Pre-processing** | Forcing the browser to parse compressed parquet files on load creates massive performance bottlenecks. Pre-baking the data into JSON makes the app load instantly for end-users. |
| **Timeline Pacing** | Live Clock (`HH:MM:SS`) vs. Index-based Slider | **Index-based Slider** | A live clock creates visual "clumping" where 50 events render at the same exact second. Tying the slider directly to the sorted data index allows for smooth, sub-second scrubbing. |