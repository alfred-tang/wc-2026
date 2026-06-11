import * as d3 from "d3";
import { useEffect, useRef } from "react";

import canadaProvinces from "/src/data/ca_provinces.json"
import mexicoStates from "/src/data/mx_states.json"
import usStates from "/src/data/us_states.json"

import { toGeoJson } from "../../../utils/helpers";
import "./Map.css";

function Map({ stadiums }) {
    const width = 800;
    const height = 850;
    const stadiumGeojson = toGeoJson(stadiums);
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .style("background-color", "transparent");

        const projection = d3.geoOrthographic()
            .scale(700)
            .center([0, 0])
            .rotate([96, -50])
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);
        const stadiumTooltip = d3.select("#stadium-tooltip")
        const tooltip = d3.select("#map-tooltip")
        const GAP = 12;
        const pinPath = `
            M12 2
            C8.1 2 5 5.1 5 9
            c0 5.2 7 13 7 13
            s7-7.8 7-13
            c0-3.9-3.1-7-7-7z
        `;

        function moveTooltip(event) {
            const { pageX, pageY } = event;

            // Make sure tooltip is visible before measuring
            const node = stadiumTooltip.node();
            const { width, height } = node.getBoundingClientRect();

            stadiumTooltip
                .style("left", `${pageX - width / 2}px`)
                .style("top", `${pageY - height - GAP}px`);
        }

        svg.append("g")
            .selectAll("path")
            .data(usStates.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "country us-state")
            .on("mouseover", (e, d) => {
                tooltip
                    .style("opacity", 1)
                    .style("left", e.pageX + 15 + "px")
                    .style("top", e.pageY - 30 + "px")
                    .html(`
                        <strong>${d.properties.NAME}, USA</strong>
                    `)
            })
            .on("mouseout", () => {
                tooltip
                    .style("opacity", 0)
            })

        svg.append("g")
            .selectAll("path")
            .data(canadaProvinces.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "country ca-province")
            .on("mouseover", (e, d) => {
                tooltip
                    .style("opacity", 1)
                    .style("left", e.pageX + 15 + "px")
                    .style("top", e.pageY - 30 + "px")
                    .html(`
                        <strong>${d.properties.name}, Canada</strong>
                    `)
            })
            .on("mouseout", () => {
                tooltip
                    .style("opacity", 0)
            })

        svg.append("g")
            .selectAll("path")
            .data(mexicoStates.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "country mx-state")
            .on("mouseover", (e, d) => {
                tooltip
                    .style("opacity", 1)
                    .style("left", e.pageX + 15 + "px")
                    .style("top", e.pageY - 30 + "px")
                    .html(`
                        <strong>${d.properties.state_name}, Mexico</strong>
                    `)
            })
            .on("mouseout", () => {
                tooltip
                    .style("opacity", 0)
            })

        const markerLayer = svg.append("g")
            .attr("class", "marker-layer");

        markerLayer
            .selectAll(".stadium")
            .data(stadiumGeojson.features)
            .enter()
            .append("path")
            .attr("class", "stadium")
            .attr("d", pinPath)
            .attr("transform", d => {
                const [x, y] = projection(d.geometry.coordinates);
                return `translate(${x - 12}, ${y - 24})`;
            })
            .style("--nation-color", d => {
                return `var(--team-${d.properties.code})`
            })
            .on("mouseover", (e, d) => {
                stadiumTooltip
                    .style("opacity", 1)
                    .style("text-align", "left")
                    .html(`
                        <img
                            class="stadium-img"
                            src="/assets/stadium/${d.properties.name.toLowerCase().split(" ").join("-")}.jpg"
                            alt="${d.properties.name}"
                            loading="lazy"
                        />
                        <div class="stadium-info">
                            <strong style="font-size: 18px;">${d.properties.name}</strong>
                            <div>${d.properties.city}, ${d.properties.state_province}</div>
                            <div>Capacity: ${d.properties.capacity} seats</div>
                        </div>
                        <img
                            class="flag-symbol"
                            src="https://flagcdn.com/h120/${d.properties.code}.png"
                            srcSet="https://flagcdn.com/h240/${d.properties.code}.png 2x"
                            alt="${d.properties.country}-flag"
                            loading='lazy'
                        />
                    `)
                moveTooltip(e)
            })
            .on("mouseout", () => {
                stadiumTooltip
                    .style("opacity", 0)
            })
    }, []);

    return (
        <div className="map-container">
            <svg width={width} height={height} ref={svgRef}></svg>
            <div id="map-tooltip" className="transparent-card"></div>
            <div id="stadium-tooltip"></div>
        </div>
    );
}

export default Map;