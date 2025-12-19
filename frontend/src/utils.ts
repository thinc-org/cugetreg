import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { defaultConfig } from 'tailwind-variants'

defaultConfig.twMerge = false

const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            'font-size': [
                {
                    text: [
                        'table-header',
                        'subtitle',
                        'body1',
                        'body2',
                        'button1',
                        'button2',
                        'caption',
                    ],
                },
            ],
        },
    },
})

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

