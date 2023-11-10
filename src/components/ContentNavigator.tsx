import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { sectionsData } from "./ContentNavigatorComponents/sectionData.ts";
import {ZoomControls} from "./ContentNavigatorComponents/ZoomControls.tsx";
import {Minimap} from "./ContentNavigatorComponents/MiniMap.tsx";
import ScrollableContent from "./ContentNavigatorComponents/ScrollableContent.tsx";
import {Chapter, HighlightRefType, LevelText} from "./ContentNavigatorComponents/utils/types.ts";

export const ContentNavigator = () => {
    const theme = useTheme();
    const [zoomLevel, setZoomLevel] = useState(1);
    const minimapRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HighlightRefType | null>(null);

    const updateHighlightPosition = () => {
        const chapterDiv = document.getElementById('chapter-zoom-div');
        if (chapterDiv && minimapRef.current && highlightRef.current) {
            const chapterDivRect = chapterDiv.getBoundingClientRect();
            const chapterStart = window.scrollY + chapterDivRect.top;
            const chapterEnd = chapterStart + chapterDivRect.height;

            // Visible part of the chapter in the viewport
            const visibleTop = Math.max(chapterStart, window.scrollY);
            const visibleBottom = Math.min(chapterEnd, window.scrollY + window.innerHeight);
            const visibleHeight = Math.max(visibleBottom - visibleTop, 0);

            // Total scrollable height of the chapter
            const totalHeight = chapterEnd - chapterStart;
            const scrollPercentage = Math.min(visibleHeight / totalHeight, 1);

            const minimapHeight = minimapRef.current.offsetHeight;
            const highlightHeight = minimapHeight * scrollPercentage;

            // Position the highlight to match the chapter's current scroll position
            let highlightTop = (visibleTop - chapterStart) / totalHeight * minimapHeight;
            highlightTop = Math.max(highlightTop, 0); // Ensure it doesn't go above the minimap

            highlightRef.current.style.height = `${highlightHeight}px`;
            highlightRef.current.style.top = `${highlightTop}px`;
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', updateHighlightPosition);
        window.addEventListener('resize', updateHighlightPosition);
        updateHighlightPosition();
        return () => {
            window.removeEventListener('scroll', updateHighlightPosition);
            window.removeEventListener('resize', updateHighlightPosition);
        };
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', updateHighlightPosition);
        window.addEventListener('resize', updateHighlightPosition);
        updateHighlightPosition();
        return () => {
            window.removeEventListener('scroll', updateHighlightPosition);
            window.removeEventListener('resize', updateHighlightPosition);
        };
    }, []);

    const onDragStart = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (highlightRef.current) {
            highlightRef.current.isDragging = true;
        }
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', onDragMove);
        document.addEventListener('touchend', onDragEnd);
    };

    const onDragMove = (event: MouseEvent | TouchEvent) => {
        if (highlightRef.current && highlightRef.current.isDragging) {
            let mouseY;
            if (event instanceof TouchEvent) {
                mouseY = event.touches[0].clientY;
            } else {
                mouseY = event.clientY;
            }

            if (minimapRef.current) {
                const minimapRect = minimapRef.current.getBoundingClientRect();
                const relativeY = mouseY - minimapRect.top;
                const scrollPercentage = relativeY / minimapRect.height;
                const chapterDiv = document.getElementById('chapter-zoom-div');
                if (chapterDiv) {
                    const chapterHeight = chapterDiv.scrollHeight;
                    const scrollY = scrollPercentage * chapterHeight;
                    window.scrollTo(0, scrollY);
                }
            }
        }
    };

    const scrollToPosition = (scrollY: number) => {
        window.scrollTo({ top: scrollY, behavior: 'smooth' });
    };

    const onMinimapClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
        const minimapRect = minimapRef.current?.getBoundingClientRect();
        if (!minimapRect) return;

        let clickY;
        if ("touches" in event) {
            clickY = event.touches[0].clientY;
        } else {
            clickY = event.clientY;
        }

        const chapterDiv = document.getElementById('chapter-zoom-div');
        if (chapterDiv) {
            const totalHeight = chapterDiv.scrollHeight;
            const clickPercentage = (clickY - minimapRect.top) / minimapRect.height;
            const scrollY = totalHeight * clickPercentage;
            scrollToPosition(scrollY);
        }
    }, []);


    useEffect(() => {
        const minimap = minimapRef.current;
        if (minimap) {
            const handleMinimapClick = (event: MouseEvent) => {
                onMinimapClick(event as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>);
            };

            minimap.addEventListener('click', handleMinimapClick);

            return () => {
                minimap.removeEventListener('click', handleMinimapClick);
            };
        }
    }, [onMinimapClick]);

    const onDragEnd = () => {
        if (highlightRef.current) {
            highlightRef.current.isDragging = false;
        }
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchmove', onDragMove);
        document.removeEventListener('touchend', onDragEnd);
    };

    useEffect(() => {
        const highlight = highlightRef.current;
        if (highlight) {
            const handleMouseDown = (event: MouseEvent) => {
                onDragStart(event as unknown as React.MouseEvent<HTMLDivElement>);
            };

            const handleTouchStart = (event: TouchEvent) => {
                onDragStart(event as unknown as React.TouchEvent<HTMLDivElement>);
            };

            highlight.addEventListener('mousedown', handleMouseDown);
            highlight.addEventListener('touchstart', handleTouchStart);

            return () => {
                highlight.removeEventListener('mousedown', handleMouseDown);
                highlight.removeEventListener('touchstart', handleTouchStart);
            };
        }
    }, [onDragStart]);

    const maxTextLength = Math.max(...sectionsData.chapters.flatMap(chapter => {
        const levelKey = `level${zoomLevel}` as keyof Chapter;
        const levelData = chapter[levelKey];

        if (Array.isArray(levelData)) {
            return levelData.map((section: LevelText) => section.text.length);
        } else {
            return [];
        }
    }));


    const renderMinimapBlocks = useCallback(() => {
        return sectionsData.chapters.flatMap((chapter, index) => {
            const headerBlock = (
                <Box
                    key={`header-${index}`}
                    sx={{
                        width: '50%',
                        height: '10px',
                        backgroundColor: 'grey.400',
                        marginBottom: theme.spacing(0.5),
                    }}
                />
            );

            const contentBlocks = (chapter[`level${zoomLevel}`] as LevelText[])?.map((content, contentIndex) => {
                const widthPercentage = (content.text.length / maxTextLength) * 100 / 1.2;
                return (
                    <Box
                        key={`${index}-${contentIndex}`}
                        sx={{
                            width: `${widthPercentage}%`,
                            maxWidth: '100%',
                            height: '20px',
                            backgroundColor: 'grey.300',
                            marginBottom: theme.spacing(0.5),
                        }}
                    />
                );
            }) || [];

            return [headerBlock, ...contentBlocks];
        });
    }, [theme, zoomLevel, maxTextLength]);

    return (
        <>
            <ZoomControls zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
            <Box sx={{ display: 'flex', height: '100vh', overFlowY: "scroll", width: '98%', p: 2 }}>
                <ScrollableContent sectionsData={sectionsData} zoomLevel={zoomLevel} />
                <Minimap
                    minimapRef={minimapRef}
                    highlightRef={highlightRef}
                    onClick={onMinimapClick}
                >
                    {renderMinimapBlocks()}
                </Minimap>
            </Box>
        </>
    );
};
