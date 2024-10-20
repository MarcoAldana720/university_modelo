'use client'

import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { Fragment, ReactNode } from 'react'

export default function Modal({ children, pathRedirect ,show}) {
    const router = useRouter()

    return (
        <>
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="dialog" onClose={() => router.replace(pathRedirect)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="semitransparente" />
                </Transition.Child>

                <div className="container_modal">
                    <div className="modal">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="dialog_panel">
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
        </>
    )
}
