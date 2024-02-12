import { CircularProgress } from '@mui/material';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';

const MyCircle = styled(CircularProgress)`
    color: #1fdf64;
    margin: 0 auto;
`;

const LoadingCircleCustom1 = ({ loading }: { loading: boolean }) => {
    const [shouldRender, setShouldRender] = useState(loading);

    useEffect(() => {
        const loadingProgress = document.querySelector('.loadingProgress');
        if (loading) {
            setShouldRender(true);
            if (loadingProgress) {
                loadingProgress.classList.remove('fadeout');
            }
        } else {
            if (loadingProgress) {
                loadingProgress.classList.add('fadeout');
            }
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    return shouldRender ? (
        <div className='loadingProgress'>
            <div className='loadingProgressModal'>
            </div>
            <div className='loadingProgressCircle'>
                <MyCircle size={200} />
            </div>
        </div >
    ) : null;
};

export default LoadingCircleCustom1;
