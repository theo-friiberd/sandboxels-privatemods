// Sandboxels Debug Tools - Force Register Mod

runAfterLoad(function() {
    const debugTools = {
        debug_inspector: {
            color: "#00ffcc",
            tool: function(pixel) {
                const info = `Pos: (${pixel.x}, ${pixel.y}) | Temp: ${pixel.temp}°C | El: ${pixel.element}`;
                console.log("[DEBUG INSPECTOR]", pixel);
                logMessage(info);
            },
            category: "worldEdit",
            desc: "Inspects pixel coordinates, temperature, and properties."
        },
        super_heat: {
            color: "#ff2a00",
            tool: function(pixel) {
                pixel.temp += 500;
                pixelTempCheck(pixel);
            },
            category: "worldEdit",
            desc: "Rapidly heats pixels by +500°C per tick."
        },
        abs_zero: {
            color: "#00aaff",
            tool: function(pixel) {
                pixel.temp = -273.15;
                pixelTempCheck(pixel);
            },
            category: "worldEdit",
            desc: "Instantly drops temperature to Absolute Zero."
        },
        reset_temp: {
            color: "#88ff88",
            tool: function(pixel) {
                pixel.temp = 20;
                pixelTempCheck(pixel);
            },
            category: "worldEdit",
            desc: "Resets temperature to 20°C."
        },
        force_charge: {
            color: "#ffff00",
            tool: function(pixel) {
                pixel.charge = 1;
                pixel.chargeCD = 5;
            },
            category: "worldEdit",
            desc: "Forces an electrical charge onto any pixel."
        },
        transmute: {
            color: ["#ff00ff", "#aa00ff"],
            tool: function(pixel) {
                if (shiftDown) {
                    window.transmuteTarget = pixel.element;
                    logMessage(`Transmute target: ${window.transmuteTarget}`);
                } else if (window.transmuteTarget && elements[window.transmuteTarget]) {
                    changePixel(pixel, window.transmuteTarget);
                }
            },
            category: "worldEdit",
            desc: "Converts pixels. Shift-click to copy element under cursor."
        },
        silent_delete: {
            color: "#222222",
            tool: function(pixel) {
                deletePixel(pixel.x, pixel.y);
            },
            category: "worldEdit",
            desc: "Silently deletes pixels without triggering reactions."
        },
        force_tick: {
            color: "#ffaa00",
            tool: function(pixel) {
                const info = elements[pixel.element];
                if (info && info.tick) info.tick(pixel);
            },
            category: "worldEdit",
            desc: "Forces target pixel to execute its behavior tick immediately."
        }
    };

    // Register each tool into the global elements list and force UI refresh
    for (const [key, data] of Object.entries(debugTools)) {
        if (!elements[key]) {
            elements[key] = data;
        }
    }

    // Re-trigger category grouping if the game function exists
    if (typeof populateLists === "function") {
        populateLists();
    }

    console.log("%c[Debug Tools Force-Injected]", "color: #00ffcc; font-weight: bold;");
});
