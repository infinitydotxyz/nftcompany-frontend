/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { MinusCircleIcon } from '@heroicons/react/solid';

interface ListItemData {
  name: string;
  handle: string;
  href: string;
  imageUrl: string;
  status: string;
}

const team: ListItemData[] = [
  {
    name: 'Crpto Bois',
    handle: 'ONI Force',
    href: '#',
    imageUrl: 'https://picsum.photos/80',
    status: 'online'
  },
  {
    name: 'Douchy Punk',
    handle: 'GReAT aPes',
    href: '#',
    imageUrl: 'https://picsum.photos/80',
    status: 'online'
  },
  {
    name: 'Fireballz Latchkey',
    handle: 'Storkz Bros',
    href: '#',
    imageUrl: 'https://picsum.photos/80',
    status: 'online'
  }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MarketOrderDrawer({ open, onClose }: Props) {
  const list = (
    <ul role="list" className="flex-1 divide-y divide-gray-200 overflow-y-auto">
      {team.map((person) => (
        <ListItem key={person.handle} person={person} />
      ))}
    </ul>
  );

  const title = 'Create Order';

  const header = (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <Dialog.Title className="text-lg font-medium text-gray-900">{title}</Dialog.Title>
        <div className="ml-3 flex h-7 items-center">
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
            onClick={onClose}
          >
            <span className="sr-only">Close panel</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="flex flex-col items-center mb-4">
      {/* divider line */}
      <div className="h-px w-full bg-slate-200 mb-4" />

      <button
        type="button"
        className="rounded-full bg-black text-white px-4 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
        onClick={onClose}
      >
        Add Order
      </button>
    </div>
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="z-50 fixed inset-0 overflow-hidden" onClose={onClose}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  {header}
                  {list}

                  {footer}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

// ==================================================================
// ==================================================================

interface Props2 {
  person: ListItemData;
}

function ListItem({ person }: Props2) {
  const menu = (
    <button
      type="button"
      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
      onClick={() => {
        console.log('flsjdfksjdlf');
      }}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full">
        <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
      </span>
    </button>
  );

  return (
    <li key={person.handle}>
      <div className="group  relative">
        <div className="flex items-center py-6 px-5 group-hover:bg-gray-50">
          <a href={person.href} className="-m-1 block flex-1 p-1">
            <div className="relative flex min-w-0 flex-1 items-center">
              <span className="relative inline-block flex-shrink-0">
                <img className="h-10 w-10 rounded-2xl" src={person.imageUrl} alt="" />
              </span>
              <div className="ml-4 truncate">
                <p className="truncate text-sm font-medium text-gray-900">{person.name}</p>
                <p className="truncate text-sm text-gray-500">{'@' + person.handle}</p>
              </div>
            </div>
          </a>
          {menu}
        </div>
      </div>
    </li>
  );
}
