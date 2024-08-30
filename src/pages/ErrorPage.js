import { FaArrowLeft } from 'react-icons/fa6';
import { ReactComponent as PageNotFound } from '../assets/svgs/PageNotFound.svg';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const nav = useNavigate();

  return (
    <div
      id="error-page"
      className="justify-center flex flex-col w-dvw h-dvh items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
      <PageNotFound className="h-1/3 w-4/5" />
      <h1 className="text-2xl pt-4 px-4 font-bold text-center">
        Sorry, the page requested was not found.
      </h1>
      <p className="mt-12 inline-flex justify-center items-center w-1/4">
        <button
          className="rounded-full w-max h-10 px-3 text-wrap cursor-pointer flex justify-center items-center font-bold text-white border-2 border-white-500 shadow-xl hover:bg-white-900 hover:bg-opacity-70 hover:text-secondary-900 hover:text-lg hover:tracking-wide"
          onClick={() => nav(-1)}>
          <FaArrowLeft />
          <span className="md:inline-flex sm:hidden xs:hidden px-1 text-base md:text-base sm:text-xs">
            Take me{' '}
          </span>
          <span className="text-base md:text-base sm:text-xs">Back</span>
        </button>
      </p>
    </div>
  );
}
