// Sandboxels Debug & God Mode Tools Mod

runAfterLoad(function() {
    // Ensure the category exists in the game's category list if it doesn't already
    if (!settings.categories.includes("debug")) {
        settings.categories.push("debug");
    }

    // 1. INSPECTOR TOOL
    if (!elements.debug_inspector) {
        elements.debug_inspector = {
            color: "#00ffcc",
            tool: function(pixel) {
                const info = [
                    `Element: ${pixel.element}`,
                    `Pos: (${pixel.x}, ${pixel.y})`,
                    `Temp: ${pixel.temp}°C`,
                    `Color: ${pixel.color}`,
                    `Charge: ${pixel.charge || 0}`
                ].join(" | ");
                
                console.log("[DEBUG INSPECTOR]", pixel);
                logMessage(info);
            },
            category: "debug",
            desc: "Inspects pixel coordinates, temperature, charge, and internal properties."
        };

        // 2. SUPER HEATER (+500°C per tick)
        elements.super_heat = {
            color: "#ff2a00",
            tool: function(pixel) {
                pixel.temp += 500;
                pixelTempCheck(pixel);
            },
            category: "debug",
            desc: "Rapidly heats pixels by +500°C per tick."
        };

        // 3. ABSOLUTE ZERO (-273.15°C instant freeze)
        elements.abs_zero = {
            color: "#00aaff",
            tool: function(pixel) {
                pixel.temp = -273.15;
                pixelTempCheck(pixel);
            },
            category: "debug",
            desc: "Instantly drops pixel temperature to Absolute Zero (-273.15°C)."
        };

        // 4. ROOM TEMP RESET (20°C)
        elements.reset_temp = {
            color: "#88ff88",
            tool: function(pixel) {
                pixel.temp = 20;
                pixelTempCheck(pixel);
            },
            category: "debug",
            desc: "Resets pixel temperature to 20°C."
        };

        // 5. FORCE CHARGE
        elements.force_charge = {
            color: "#ffff00",
            tool: function(pixel) {
                pixel.charge = 1;
                pixel.chargeCD = 5;
            },
            category: "debug",
            desc: "Forces an electrical charge onto any pixel."
        };

        // 6. TRANSMUTE
        let transmuteTarget = "gold";
        elements.transmute = {
            color: ["#ff00ff", "#aa00ff"],
            tool: function(pixel) {
                if (shiftDown) {
                    transmuteTarget = pixel.element;
                    logMessage(`Transmute target copied: ${transmuteTarget}`);
                } else if (pixel.element !== transmuteTarget && elements[transmuteTarget]) {
                    changePixel(pixel, transmuteTarget);
                }
            },
            category: "debug",
            desc: "Converts pixels into a target element. Shift-click to copy element."
        };

        // 7. SILENT DELETE
        elements.silent_delete = {
            color: "#222222",
            tool: function(pixel) {
                deletePixel(pixel.x, pixel.y);
            },
            category: "debug",
            desc: "Silently deletes pixels from the grid without triggering reactions."
        };

        // 8. FORCE TICK
        elements.force_tick = {
            color: "#ffaa00",
            tool: function(pixel) {
                const info = elements[pixel.element];
                if (info && info.tick) {
                    info.tick(pixel);
                }
            },
            category: "debug",
            desc: "Forces the target pixel to execute its behavior tick rapidly."
        };
    }

    // HUD & Helpers
    let hudEnabled = false;
    let hudDiv = document.createElement("div");
    hudDiv.style.cssText = `
        position: fixed; top: 10px; left: 10px; z-index: 9999;
        background: rgba(0, 0, 0, 0.75); color: #00ffcc;
        font-family: monospace; font-size: 12px; padding: 8px 12px;
        border: 1px solid #00ffcc; border-radius: 4px; pointer-events: none;
        display: none;
    `;
    document.body.appendChild(hudDiv);

    let lastTime = performance.now();
    let frames = 0;
    let fps = 0;

    function updateHUD() {
        frames++;
        const now = performance.now();
        if (now - lastTime >= 500) {
            fps = Math.round((frames * 1000) / (now - lastTime));
            frames = 0;
            lastTime = now;
        }
        if (hudEnabled) {
            const pCount = typeof currentPixels !== "undefined" ? currentPixels.length : 0;
            hudDiv.innerHTML = `
                <b>[DEBUG HUD]</b><br>
                FPS: ${fps} | TPS: ${tps}<br>
                Pixels: ${pCount}
            `;
        }
        requestAnimationFrame(updateHUD);
    }
    requestAnimationFrame(updateHUD);

    document.addEventListener("keydown", function(e) {
        if (document.activeElement.tagName === "INPUT") return;
        if (e.key.toLowerCase() === "g") {
            hudEnabled = !hudEnabled;
            hudDiv.style.display = hudEnabled ? "block" : "none";
        }
    });

    console.log("%c[Debug Tools Loaded Successfully]", "color: #00ffcc; font-weight: bold;");
});
