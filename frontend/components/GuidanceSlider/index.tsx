'use client';
import { styled } from '@mui/material/styles';
import Slider, { SliderProps } from '@mui/material/Slider';
const GuidanceSlider = styled(Slider)<SliderProps>(() => ({
  '& .MuiSlider-thumb': {
    backgroundColor: '#7c71ff',
    border: '1px solid #7c71ff',
    '&:hover': {
      boxShadow: '0px 0px 0px 8px rgba(124, 113, 255, 0.16)'
    },
    '&:active': {
      boxShadow: '0px 0px 0px 8px rgba(124, 113, 255, 0.16)'
    }
  }
}));
export default GuidanceSlider;
