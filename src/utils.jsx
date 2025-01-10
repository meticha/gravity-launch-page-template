import SVGPathCommander from "svg-path-commander";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { elementsConfig } from "./constants";
import { useEffect, useRef } from "react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getRandomNumber(min = 0, max = 100) {
  // Ensure parameters are numbers and min is less than max
  min = Number(min);
  max = Number(max);
  if (min > max) [min, max] = [max, min];

  // Calculate random number between min and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const generateUniqueElements = () => {
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseDown = () => {
      isDragging.current = false;
    };

    const handleMouseMove = () => {
      isDragging.current = true;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return shuffleArray(
    elementsConfig.map((elementConfig) => {
      if (elementConfig.type === "image") {
        const imageElement = (
          <img
            src={elementConfig.src}
            alt="Shape"
            className={cn(
              elementConfig.width,
              elementConfig.height,
              elementConfig.isLink && " border rounded-3xl"
            )}
            style={elementConfig.imageStyle}
            draggable={false}
          />
        ); 

        if (elementConfig.isLink) {
          return (
            <div
              style={elementConfig.containerStyle}
              className="pointer-events-auto"
            >
              <a
                href={elementConfig.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block "
                onClick={(e) => {
                  if (!isDragging.current) {
                    e.stopPropagation();
                  } else {
                    e.preventDefault(); // Prevent link click while dragging
                  }
                }}
              >
                {imageElement}
              </a>
            </div>
          );
        }
        return imageElement;
      }

      if (elementConfig.type === "component") {
        return <elementConfig.component />;
      }

      return (
        <div
          className={cn(
            elementConfig.style.width,
            elementConfig.style.height,
            elementConfig.style.backgroundColor,
            elementConfig.style.borderRadius,
            elementConfig.style.borderLeft,
            elementConfig.style.borderRight,
            elementConfig.style.borderBottom
          )}
        ></div>
      );
    })
  );
};


// Function to convert SVG path "d" to vertices
export function parsePathToVertices(path, sampleLength = 15) {
  // Convert path to absolute commands
  const commander = new SVGPathCommander(path);

  const points = [];
  let lastPoint = null;

  // Get total length of the path
  const totalLength = commander.getTotalLength();
  let length = 0;

  // Sample points along the path
  while (length < totalLength) {
    const point = commander.getPointAtLength(length);

    // Only add point if it's different from the last one
    if (!lastPoint || point.x !== lastPoint.x || point.y !== lastPoint.y) {
      points.push({ x: point.x, y: point.y });
      lastPoint = point;
    }

    length += sampleLength;
  }

  // Ensure we get the last point
  const finalPoint = commander.getPointAtLength(totalLength);
  if (
    lastPoint &&
    (finalPoint.x !== lastPoint.x || finalPoint.y !== lastPoint.y)
  ) {
    points.push({ x: finalPoint.x, y: finalPoint.y });
  }

  return points;
}

export function calculatePosition(
  value,
  containerSize,
  elementSize,
  isVerticalLaunch = false,
  isRandom = false
) {
  if (isRandom) {
    // Generate a random position within the container bounds
    const padding = elementSize / 2;
    const min = isVerticalLaunch ? -elementSize : padding;
    const max = containerSize - padding;
    return Math.random() * (max - min) + min; // Random value within [min, max]
  }

  if (typeof value === "string" && value.endsWith("%")) {
    const percentage = parseFloat(value) / 100;

    // Add padding to prevent objects from being placed too close to edges
    const padding = elementSize / 2;
    const availableSize = containerSize - padding * 2;

    // For vertical launch, allow values outside the visible area (e.g., negative)
    if (isVerticalLaunch) {
      return -elementSize + availableSize * percentage; // Start above the container
    }

    return padding + availableSize * percentage;
  }

  return typeof value === "number"
    ? isVerticalLaunch
      ? Math.min(containerSize - elementSize / 2, Math.max(-elementSize, value)) // Allow negative values
      : value
    : Math.min(containerSize - elementSize / 2, Math.max(elementSize / 2, elementSize));
}



export const generateRandomElement = () => {
  const randomElement =
    elementsConfig[Math.floor(Math.random() * elementsConfig.length)];

  if (randomElement.type === "image") {
    return (
      <img
        src={randomElement.src}
        alt="Shape"
        width={randomElement.width}
        height={randomElement.height}
      />
    );
  }
  if (randomElement.type === "component") {
    return <randomElement.component />;
  }

  return <div style={randomElement.style}></div>;
};
