export interface LevelText {
    text: string;
}

export interface Chapter {
    header2: string;
    level1: LevelText[];
    level2: LevelText[];
    level3: LevelText[];
    level4: LevelText[];
    level5: LevelText[];
}

export interface Sections {
    title: string;
    chapters: Chapter[];
}

export interface ChapterZoomDivProps {
    sections: Sections;
    zoomLevel: number;
    id?: string;
}

export interface HighlightRefType extends HTMLDivElement {
    isDragging: boolean;
}
