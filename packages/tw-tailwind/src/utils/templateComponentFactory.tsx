import clsx, { ClassValue } from 'clsx'
import { ComponentType, PropsWithoutRef, RefAttributes, forwardRef } from 'react'
import { cleanTemplate } from './cleanTemplate'
import { mergeArrays } from './mergeArrays'
import React from 'react'
/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import { twMerge } from 'tailwind-merge'

declare global {
  export interface ArrayConstructor {
    isArray(arg: ReadonlyArray<any> | any): arg is ReadonlyArray<any>
  }
}

export function templateComponentFactory<
  TComponentProps extends {
    className?: string
  },
  Ref = never,
>(
  Element: ComponentType<PropsWithoutRef<TComponentProps> & RefAttributes<Ref>>,
): <TTWProps extends {}>(
  template: TemplateStringsArray | ((props: PropsWithoutRef<TComponentProps> & TTWProps) => ClassValue[]),
  ...templateElements: ((props: PropsWithoutRef<TComponentProps> & TTWProps) => string | boolean | undefined | null)[]
) => React.ForwardRefExoticComponent<PropsWithoutRef<PropsWithoutRef<TComponentProps> & TTWProps> & RefAttributes<Ref>>

export function templateComponentFactory(Element: ReadonlyArray<string>): string

export function templateComponentFactory<TComponentProps extends { className?: string }, Ref = never>(
  Element: React.ComponentType<PropsWithoutRef<TComponentProps> & RefAttributes<Ref>> | ReadonlyArray<string>,
) {
  if (Array.isArray(Element)) {
    return twMerge(Element[0])
  }

  return <TTWProps extends {}>(
    template: TemplateStringsArray | ((props: PropsWithoutRef<TComponentProps> & TTWProps) => ClassValue[]),
    ...templateElements: ((props: PropsWithoutRef<TComponentProps> & TTWProps) => string | boolean | undefined | null)[]
  ) =>
    forwardRef<Ref, PropsWithoutRef<TComponentProps> & TTWProps>((props, ref) => {
      return (
        <Element
          {...props}
          className={
            typeof template === 'function'
              ? clsx(template(props), props.className)
              : cleanTemplate(
                  mergeArrays(
                    template,
                    templateElements.map((t) => t(props)),
                  ),
                  props.className,
                )
          }
          ref={ref}
        />
      )
    })
}

