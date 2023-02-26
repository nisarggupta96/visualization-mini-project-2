import { useMemo } from "react";
import { ScaleLinear } from "d3";
import { COLORS, FONT_SIZE } from "@/constants";

type AxisLeftProps = {
    yScale: ScaleLinear<number, number>;
    pixelsPerTick: number;
    width: number;
    fontSize?: String;
};

const TICK_LENGTH = 10;

export const AxisLeft = ({ yScale, pixelsPerTick, width, fontSize = FONT_SIZE.MEDIUM }: AxisLeftProps) => {
    const range = yScale.range();

    const ticks = useMemo(() => {
        const height = range[0] - range[1];
        const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

        return yScale.ticks(numberOfTicksTarget).map((value) => ({
            value,
            yOffset: yScale(value),
        }));
    }, [yScale]);

    return (
        <>
            {/* Ticks and labels */}
            {ticks.map(({ value, yOffset }) => (
                <g
                    key={value}
                    transform={`translate(0, ${yOffset})`}
                    shapeRendering={"crispEdges"}
                >
                    <line
                        x1={-TICK_LENGTH}
                        x2={width + TICK_LENGTH}
                        stroke="#D2D7D3"
                        strokeWidth={0.5}
                        shapeRendering={"crispEdges"}
                    />
                    <text
                        key={value}
                        style={{
                            textAnchor: "middle",
                            transform: "translateX(-20px)",
                            fill: COLORS.TEXT_COLOR,
                            fontSize: fontSize
                        }}
                    >
                        {value}
                    </text>
                </g>
            ))}
        </>
    );
};
