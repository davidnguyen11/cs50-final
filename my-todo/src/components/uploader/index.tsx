import * as React from 'react';
import { Box, Button, Theme, Typography, withStyles, withTheme } from '@material-ui/core';
import { ExportInterface } from 'react-images-uploading/dist/typings';

const styles = (theme: Theme) => ({
  wrapper: {
    border: `3px dashed ${theme.palette.grey[500]}`,
    'border-radius': 4,
    'text-align': 'center',
  },
  boldText: {
    'font-weight': 'bold',
  },
  icon: {
    height: '5rem',
  },
});

function UploaderComponent(props: Props) {
  const { classes, onImageUpload, dragProps, isDragging, theme } = props;

  const styles = isDragging
    ? {
      style: {
        opacity: 0.3,
      },
    }
    : {};

  const Icon = () => {
    return (
      <svg
        className={classes.icon}
        style={{ fill: theme.palette.primary.main }}
        x="0px"
        y="0px"
        viewBox="0 0 512.001 512.001"
      >
        <g>
          <g>
            <path
              d="M405.967,195.112c-1.069-78.061-64.902-141.239-143.213-141.239c-34.835,0-68.396,12.672-94.498,35.682
            c-23.296,20.535-39.232,47.977-45.543,78.106c-0.461-0.005-0.918-0.009-1.374-0.009C54.434,167.652,0,222.085,0,288.991
            S54.434,410.33,121.34,410.33h84.743c6.029,0,10.919-4.888,10.919-10.919c0-6.031-4.89-10.919-10.919-10.919H121.34
            c-54.866,0-99.502-44.636-99.502-99.501c0-54.865,44.636-99.501,99.502-99.501c2.923,0,6.013,0.157,9.448,0.48
            c5.822,0.545,11.049-3.596,11.842-9.396c3.932-28.82,18.161-55.327,40.067-74.638c22.111-19.492,50.542-30.226,80.056-30.226
            c66.935,0,121.389,54.455,121.389,121.389c0,2.41-0.179,4.894-0.368,7.524l-0.081,1.118c-0.227,3.212,0.975,6.361,3.287,8.604
            c2.309,2.243,5.488,3.351,8.697,3.03c2.904-0.293,5.834-0.44,8.708-0.44c47.297,0,85.778,38.48,85.778,85.778
            c0,47.297-38.48,85.777-85.778,85.777h-89.111c-6.029,0-10.919,4.888-10.919,10.919c0,6.031,4.89,10.919,10.919,10.919h89.111
            c59.339,0,107.616-48.275,107.616-107.615C512,243.906,464.58,195.961,405.967,195.112z"
            />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M262.755,105.192c-45.658,0-84.742,34.121-90.914,79.367c-0.815,5.975,3.369,11.48,9.343,12.295
            c0.501,0.068,0.998,0.102,1.489,0.102c5.375,0,10.059-3.97,10.804-9.444c4.703-34.48,34.486-60.482,69.277-60.482
            c6.031,0,10.919-4.888,10.919-10.919C273.674,110.081,268.785,105.192,262.755,105.192z"
            />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M312.41,320.052l-39.718-35.48c-6.847-6.12-17.177-6.119-24.027-0.001l-39.718,35.482
            c-4.498,4.017-4.886,10.92-0.869,15.418c4.017,4.496,10.919,4.887,15.418,0.869l26.264-23.462v134.331
            c0,6.031,4.888,10.919,10.919,10.919c6.03,0,10.919-4.888,10.919-10.919V312.876l26.265,23.463
            c2.082,1.861,4.681,2.776,7.27,2.776c3.002,0,5.99-1.229,8.148-3.645C317.296,330.972,316.907,324.07,312.41,320.052z"
            />
          </g>
        </g>
      </svg>
    );
  };

  return (
    <div draggable {...styles} {...dragProps}>
      <Box className={classes.wrapper} p={5}>
        <Icon />
        <Typography className={classes.boldText}>Drag and drop image file here</Typography>

        <Box mt={1} mb={1}>
          <Typography>or</Typography>
        </Box>

        <Button onClick={onImageUpload} variant="contained" color="primary">
          Browse file
        </Button>
      </Box>
    </div>
  );
}

const Uploader = withStyles(styles)(withTheme(UploaderComponent));

export { Uploader };

type Props = ReactImageUploadingProps & UploaderProps;

type ReactImageUploadingProps = Pick<ExportInterface, 'dragProps' | 'isDragging' | 'onImageUpload'>;

interface UploaderProps {
  classes?: {
    wrapper: string;
    boldText: string;
    icon: string;
  };
  theme: Theme;
}
