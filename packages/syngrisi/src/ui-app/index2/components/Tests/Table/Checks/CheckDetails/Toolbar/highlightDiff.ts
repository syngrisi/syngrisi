/* eslint-disable no-console */
import { fabric } from 'fabric';
import { MainView } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/mainView';

export interface IGroup {
    minX: number
    maxX: number
    minY: number
    maxY: number
    imageData: any,
    members: { x: number, y: number }[],
}

/**
 * Check if two groups are within merge distance of each other
 */
function groupsAreNearby(a: IGroup, b: IGroup, mergeDistance: number): boolean {
    // Check if bounding boxes are within mergeDistance pixels
    const horizontalGap = Math.max(0, Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX));
    const verticalGap = Math.max(0, Math.max(a.minY, b.minY) - Math.min(a.maxY, b.maxY));
    return horizontalGap <= mergeDistance && verticalGap <= mergeDistance;
}

/**
 * Merge two groups into one
 */
function mergeGroups(a: IGroup, b: IGroup): IGroup {
    return {
        minX: Math.min(a.minX, b.minX),
        maxX: Math.max(a.maxX, b.maxX),
        minY: Math.min(a.minY, b.minY),
        maxY: Math.max(a.maxY, b.maxY),
        imageData: a.imageData,
        members: [...a.members, ...b.members],
    };
}

/**
 * Merge nearby groups that are within mergeDistance pixels of each other
 * This reduces the number of small regions when there are many close differences
 * @param groups - Array of groups to merge
 * @param mergeDistance - Maximum distance in pixels between groups to merge (default: 0 = no merging)
 * @returns Merged groups array
 */
export function mergeNearbyGroups(groups: IGroup[], mergeDistance: number = 0): IGroup[] {
    if (mergeDistance <= 0 || groups.length <= 1) {
        return groups;
    }

    let result = [...groups];
    let merged = true;

    // Keep merging until no more merges happen
    while (merged) {
        merged = false;
        const newResult: IGroup[] = [];
        const used = new Set<number>();

        for (let i = 0; i < result.length; i++) {
            if (used.has(i)) continue;

            let current = result[i];

            for (let j = i + 1; j < result.length; j++) {
                if (used.has(j)) continue;

                if (groupsAreNearby(current, result[j], mergeDistance)) {
                    current = mergeGroups(current, result[j]);
                    used.add(j);
                    merged = true;
                }
            }

            newResult.push(current);
            used.add(i);
        }

        result = newResult;
    }

    return result;
}

function getDiffImageData(image: any) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');

    ctx!.drawImage(image, 0, 0);

    const imgData = ctx!.getImageData(0, 0, image.width, image.height);
    return imgData;
}

export interface HighlightDiffOptions {
    skipAnimation?: boolean;
}

export function highlightDiff(
    mainView: MainView,
    highlightsGroups: IGroup[] | null,
    imageData: any,
    options: HighlightDiffOptions = {},
): Promise<{ groups: IGroup[], diffImageData: any }> {
    const { skipAnimation = false } = options;

    return new Promise((resolve) => {
        // remove highlights (only if animating)
        if (!skipAnimation) {
            mainView.canvas.getObjects()
                .filter((x) => x.name === 'highlight')
                .forEach((x) => mainView.canvas.remove(x));
        }

        // get image data
        const urlData = mainView.diffImage.toDataURL({});
        const img = new Image();
        img.src = urlData;

        img.onload = () => {
            console.time('get_image_data');
            const diffImageData = imageData || getDiffImageData(img);
            console.timeEnd('get_image_data');

            console.time('process_data');

            const createNewGroup = (x: number, y: number) => ({
                minX: x,
                maxX: x,
                minY: y,
                maxY: y,
                members: [{ x, y }],
            });
            // get pixel color string from flat array of image data e.g.: '255,0,255,255'(rgba)
            // eslint-disable-next-line max-len
            const getPixel = (x: number, y: number, curCount: number): string => diffImageData.data.slice(curCount, curCount + 4).join();

            const diffColor = '255,0,255,255';
            const groups: IGroup[] = highlightsGroups || [];

            console.time('group formation');
            if (groups.length < 1) {
                let cursorCount = 0;
                for (let y = 0; y < diffImageData.height; y += 1) {
                    for (let x = 0; x < diffImageData.width; x += 1) {
                        // console.log(getPixel(x, y, cursorCount), diffColor);
                        if (getPixel(x, y, cursorCount) === diffColor) {
                            const suitableGroup = groups.find((group) => x >= group.minX - 1
                                && x <= group.maxX + 1
                                && y >= group.minY
                                && y <= group.maxY + 1);

                            if (!suitableGroup) {
                                groups.push(createNewGroup(x, y));
                            } else if (
                                getPixel(x - 1, y, cursorCount) === diffColor // left
                                || getPixel(x - 1, y - 1, cursorCount) === diffColor // top left
                                || getPixel(x, y - 1, cursorCount) === diffColor // top
                                || getPixel(x + 1, y - 1, cursorCount) === diffColor // top right
                                || getPixel(x + 1, y, cursorCount) === diffColor //  right
                                || getPixel(x + 1, y + 1, cursorCount) === diffColor // bottom right
                                || getPixel(x, y + 1, cursorCount) === diffColor // bottom
                                || getPixel(x - 1, y + 1, cursorCount) === diffColor // bottom left
                            ) {
                                suitableGroup.members.push({ x, y });
                                if (x < suitableGroup.minX) suitableGroup.minX = x;
                                if (x > suitableGroup.maxX) suitableGroup.maxX = x;
                                if (y > suitableGroup.maxY) suitableGroup.maxY = y;
                            }
                        }

                        cursorCount += 4;
                    }
                }
            }
            console.timeEnd('group formation');
            console.timeEnd('process_data');

            // Skip animation if requested (for auto-region feature)
            if (skipAnimation) {
                return resolve({ groups, diffImageData });
            }

            console.time('group handling');
            // eslint-disable-next-line no-restricted-syntax
            for (const group of groups) {
                // console.log(group);
                const top = group.minY + (group.maxY - group.minY) / 2;
                const left = group.minX + (group.maxX - group.minX) / 2;
                const circle = new fabric.Circle({
                    name: 'highlight',
                    originX: 'center',
                    originY: 'center',
                    left,
                    top,
                    // radius: 5,
                    data: { group },
                    fill: '#D6336C',
                    opacity: 0.3,
                    strokeWidth: 0,
                    selectable: false,
                });
                mainView.canvas.add(circle);
            }
            console.timeEnd('group handling');

            const highlightRemoving = () => {
                mainView.canvas.getObjects()
                    .filter((x) => x.name === 'highlight')
                    .forEach((x) => mainView.canvas.remove(x));
            };

            // highlights animation
            setTimeout(() => {
                mainView.canvas.getObjects()
                    .filter((x) => x.name === 'highlight')
                    .forEach((circle) => {
                        const suitableRadius = Math.max(
                            circle.data.group.maxX - circle.data.group.minX,
                            circle.data.group.maxY - circle.data.group.minY,
                        );
                        const radius = ((suitableRadius > 25 ? suitableRadius : 25) + Math.floor(Math.random() * 10))
                            / mainView.canvas.getZoom();

                        circle.animate('opacity', '0.5', {
                            onChange: mainView.canvas.renderAll.bind(mainView.canvas),
                            duration: 500,
                        });

                        circle.animate('radius', String(radius), {
                            onChange: mainView.canvas.renderAll.bind(mainView.canvas),
                            duration: 500,
                            onComplete: () => {
                                circle.animate('radius', '0.00', {
                                    onChange: mainView.canvas.renderAll.bind(mainView.canvas),
                                    // slowHighlight - for testing purposes
                                    duration: window?.slowHighlight ? 15000 : 700,
                                    onComplete: highlightRemoving,
                                });
                                circle.animate('opacity', '0.30', {
                                    onChange: mainView.canvas.renderAll.bind(mainView.canvas),
                                    duration: window?.slowHighlight ? 3000 : 700,
                                });
                            },
                        });
                    });
                mainView.canvas.renderAll();
            }, 0);
            return resolve({ groups, diffImageData });
        };
    });
}
