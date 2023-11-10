import React, {  useRef, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import gsap from 'gsap';
import {ChapterZoomDivProps, Chapter} from "./utils/types.ts";

export const ChapterZoomDiv: React.FC<ChapterZoomDivProps> = ({ id, sections, zoomLevel }) => {
    const theme = useTheme();
    const contentBoxRef = useRef<HTMLDivElement>(null);
    const levelTextRefs = useRef<Map<string, HTMLParagraphElement | null>>(new Map());

    useEffect(() => {
        levelTextRefs.current.forEach((el) => {
            if (el) {
                gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 });
            }
        });
    }, [zoomLevel]);

    return (
            <Box
                ref={contentBoxRef}
                id={id}
                sx={{
                    pr: 2
                }}
            >
                <Typography variant="h4" gutterBottom>
                    {sections.title}
                </Typography>
                {sections.chapters.map((chapter, index) => (
                    <Box key={index} sx={{ marginBottom: theme.spacing(4) }}>
                        <Typography variant="h6" gutterBottom>
                            {chapter.header2}
                        </Typography>
                        {chapter[`level${zoomLevel}` as keyof Chapter].map((paragraph, paraIndex) => (
                            <Typography
                                key={`${index}-${paraIndex}`}
                                variant="body1"
                                paragraph
                                ref={(el) => {
                                    const key = `${index}-${paraIndex}`;
                                    if (el) {
                                        levelTextRefs.current.set(key, el);
                                    } else {
                                        levelTextRefs.current.delete(key);
                                    }
                                }}
                            >
                                {paragraph.text}
                            </Typography>
                        ))}
                    </Box>
                ))}
            </Box>
    );
};
