import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';

import { RiCloseLine } from 'react-icons/ri';

export const SlideOver = React.forwardRef(
  (
    {
      children,
      id,
      title,
      subtitle,
      open: isOpen = true,
      onClose,
      disableCloseOnBackdropClicked = false,
      onCloseButtonClick,
    },
    ref
  ) => {
    const [open, setOpen] = useState(isOpen);

    useEffect(() => {
      setOpen(isOpen);
    }, [isOpen]);

    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          id={id || 'slide-over-dialog'}
          ref={ref}
          as="div"
          className="relative z-10"
          onClose={() => {
            setOpen(false);
            onClose();
          }}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 bg-white/50" aria-hidden="true" />
          <div className="fixed inset-0 w-screen overflow-y-auto">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full lg:w-1/2 md:w-7/12 sm:w-2/3 ">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                {disableCloseOnBackdropClicked ? (
                  <div className="pointer-events-auto flex h-full w-full flex-col bg-white pb-6 overflow-y-auto">
                    <div className="bg-neutral rounded p-6">
                      <Dialog.Title className="text-md capitalize font-semibold leading-6 text-primary-dark">
                        {title}
                        <div
                          id="subtitle"
                          className="mt-2 text-slate-500 text-xs font-mono font-extralight">
                          {subtitle}
                        </div>
                        <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                          <button
                            type="button"
                            className="relative rounded-md text-slate-700 hover:ring-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            onClick={() => {
                              if (!!onCloseButtonClick) {
                                onCloseButtonClick();
                              } else {
                                setOpen(false);
                                onClose();
                              }
                            }}>
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close</span>
                            <RiCloseLine
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {children}
                    </div>
                  </div>
                ) : (
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-full">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0">
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-slate-700 hover:ring-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                          onClick={() => {
                            if (!!onCloseButtonClick) {
                              onCloseButtonClick();
                            } else {
                              setOpen(false);
                              onClose();
                            }
                          }}>
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close</span>
                          <RiCloseLine className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="pointer-events-auto flex h-full w-full flex-col bg-white pb-6 overflow-y-auto">
                      <div className="bg-neutral rounded p-6">
                        <Dialog.Title className="text-md capitalize font-semibold leading-6 text-primary-dark">
                          {title}
                          <div
                            id="subtitle"
                            className="mt-2 text-slate-500 text-xs font-mono font-extralight">
                            {subtitle}
                          </div>
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {children}
                      </div>
                    </div>
                  </Dialog.Panel>
                )}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }
);
