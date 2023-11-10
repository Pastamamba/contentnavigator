import { Box } from "@mui/material";
import { ChapterZoomDiv } from "./ChapterZoomDiv.tsx";
import { Sections } from "./utils/types.ts";
import React from "react";

interface ScrollableContentProps {
    sectionsData: Sections;
    zoomLevel: number;
}

const ScrollableContent: React.FC<ScrollableContentProps> = ({ sectionsData, zoomLevel }) => {
    return (
        <Box sx={{ width: '80%', pr: 2 }}>
            <ChapterZoomDiv id={"chapter-zoom-div"} sections={sectionsData} zoomLevel={zoomLevel} />
        </Box>
    );
};

export default ScrollableContent;
