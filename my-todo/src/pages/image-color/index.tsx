import Head from 'next/head';
import React from 'react';
import {
  Box,
  Button,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  withStyles,
  IconButton,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Close } from '@material-ui/icons';
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading';
import quantize from 'quantize';
import { createPixelArray } from '../../utils/create-pixel-array';
import { getRGB } from '../../utils/get-rgb';
import { getHexColor } from '../../utils/get-hex-color';
import { Uploader } from '../../components/uploader';

const IMAGE_HEIGHT = 500;
const MAX_NUMBER_PALETTE = 5;
const TWO_SECOND = 2000;
const QUALITY = 10;

const styles = () => ({
  colorButton: {
    height: 40,
    width: 40,
    borderRadius: '100%',
    minWidth: 'auto',
  },
});

function ImageColorPage(props: Props) {
  const [images, setImages] = React.useState<ImageListType>([]);
  const [imageTitle, setImageTitle] = React.useState<string>(undefined);
  const [palette, setPalette] = React.useState<Uint8ClampedArray[]>([]);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [copiedColor, setCopiedColor] = React.useState(undefined);
  const [colorMode, setColorMode] = React.useState<CopyColorMode>('hex');

  const onChange = (imageList: ImageType[]) => {
    if (!imageList.length) return;
    const { file } = imageList[0];
    setImages(imageList);
    setImageTitle(file.name);

    const photo = document.getElementById('photo') as HTMLImageElement;

    photo.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const width = (canvas.width = photo.naturalWidth);
      const height = (canvas.height = photo.naturalHeight);
      context.drawImage(photo, 0, 0, width, height);

      const data = context.getImageData(0, 0, width, height).data;
      const size = width * height;
      const pixels = createPixelArray(data, size, QUALITY);
      const cmap = quantize(pixels, MAX_NUMBER_PALETTE);
      const palette = cmap ? cmap.palette() : null;
      setPalette(palette);
    };
  };

  const renderImageColorCard = () => {
    if (!images.length) return;
    const { classes } = props;
    const dominantColor = palette[0];

    const copy = (e) => {
      e.preventDefault();
      const imageColorBoard = document.getElementById('image-color-board');
      const arrayColor = e.target.dataset.rgb.split(',').map((item) => parseInt(item));
      const input = document.createElement('input');

      const color = colorMode === 'hex' ? getHexColor(arrayColor) : getRGB(arrayColor);

      input.style.position = 'absolute';
      input.style.top = '-1000px';
      imageColorBoard.append(input);
      input.id = 'copy-input';
      input.value = color;
      input.select();
      document.execCommand('copy');
      setOpenSnackBar(true);
      setCopiedColor(color);
      input.remove();
    };

    const handleChangeColorMode = () => {
      setColorMode(colorMode === 'hex' ? 'rgb' : 'hex');
    };

    const imageSrc = images[0].dataURL;
    const switchLabel = `Copy as ${colorMode === 'hex' ? 'RGB' : 'HEX'} color code`;

    return (
      <Box mt={2}>
        <Card>
          <CardMedia component="img" height={IMAGE_HEIGHT} image={imageSrc} title={imageTitle} id="photo" />
          <CardContent>
            <FormControlLabel
              control={<Switch onChange={handleChangeColorMode} name="rgb-mode" color="primary" />}
              label={switchLabel}
            />
          </CardContent>

          <CardContent>
            <Alert severity="info">Click color to copy</Alert>
          </CardContent>

          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Dominant Color
            </Typography>
            <Button
              onClick={copy}
              data-rgb={dominantColor}
              className={classes.colorButton}
              style={{ background: getRGB(dominantColor) }}
            />
          </CardContent>

          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Palette
            </Typography>
            {palette.map((color, index) => (
              <Box component="span" mr={1} key={index}>
                <Button
                  onClick={copy}
                  data-rgb={color}
                  className={classes.colorButton}
                  style={{ background: getRGB(color) }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    );
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <Container maxWidth="sm">
      <Head>
        <title>Extract colors from image</title>
      </Head>

      <Box id="image-color-board" mb={2}>
        <ImageUploading value={images} onChange={onChange}>
          {({ onImageUpload, isDragging, dragProps }) => (
            <Uploader isDragging={isDragging} dragProps={dragProps} onImageUpload={onImageUpload} />
          )}
        </ImageUploading>

        {renderImageColorCard()}

        <Snackbar
          open={openSnackBar}
          autoHideDuration={TWO_SECOND}
          message={
            <span>
              Copied <b>{copiedColor}</b>
            </span>
          }
          onClose={handleCloseSnackBar}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackBar}>
              <Close fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </Container>
  );
}

export default withStyles(styles)(ImageColorPage);

interface Props {
  classes: {
    colorButton: string;
  };
}

type CopyColorMode = 'rgb' | 'hex';
