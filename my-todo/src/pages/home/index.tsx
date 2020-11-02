import Head from 'next/head';
import Button from '@material-ui/core/Button';
import style from './home.module.scss';

export default function HomePage() {
  console.log(style);
  return (
    <div className={style.home}>
      <Head>
        <title>Leapee</title>
      </Head>

      <Button variant="contained" color="primary">
        Primary
      </Button>
    </div>
  );
}
