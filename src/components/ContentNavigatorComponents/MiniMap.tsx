import {Box, useTheme} from '@mui/material';

export const Minimap = ({ minimapRef, highlightRef, onClick, children }) => {
    const theme = useTheme();
    return (
        <Box
            ref={minimapRef}
            onClick={onClick}
            sx={{
                width: '15%',
                position: 'fixed',
                top: `calc(5% + ${theme.spacing(2)})`,
                left: `calc(82% + ${theme.spacing(2)})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                maxHeight: '80%',
                overflowY: 'auto',
                backgroundColor: theme.palette.grey[200],
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'grey.300',
                },
            }}
        >
            <div
                ref={highlightRef}
                style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(255, 255, 0, 0.2)',
                    width: '100%',
                }}
            />
            {children}
        </Box>
    );
};
