import {Box, IconButton, useTheme} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export const ZoomControls = ({ zoomLevel, setZoomLevel }) => {
    const incrementZoomLevel = () => setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 1, 5));
    const decrementZoomLevel = () => setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 1, 1));
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <IconButton onClick={decrementZoomLevel} disabled={zoomLevel === 1}>
                <RemoveIcon />
            </IconButton>
            {[1, 2, 3, 4, 5].map((level) => (
                <Box
                    key={level}
                    sx={{
                        width: theme.spacing(3),
                        height: theme.spacing(1),
                        backgroundColor: zoomLevel === level ? 'primary.main' : 'grey.300',
                        margin: theme.spacing(0.5),
                    }}
                />
            ))}
            <IconButton onClick={incrementZoomLevel} disabled={zoomLevel === 5}>
                <AddIcon />
            </IconButton>
        </Box>
    );
};
