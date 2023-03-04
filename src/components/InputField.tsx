/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import './inputfield.scss';

interface NumberInputProps {
    value?: number
    showButtons?: boolean
    onChange?: (value: number) => void
    placeholder?: string
    suffix?: string
    style?: React.CSSProperties
}

const NumberInput = ({value, onChange, showButtons, suffix, placeholder, style}: NumberInputProps) => {
    const [text, setText] = React.useState('');
    const refInput = React.useRef<HTMLInputElement>(null);

    React.useEffect(()=>{setText(`${value} ${suffix}`)}, [value])

    const onFocus = () => {
        if (suffix) setText(text.replace(suffix, '').trim())
        refInput.current?.select()
    }
    
    const onBlur = () => {
        if (suffix) setText(`${text} ${suffix}`)
    }

    const onChangeValue = (value: string) => {
        const v = parseInt(value)
        if (onChange) onChange(v)
        setText(String(v))
    }

    const onUp = () => {
        let v = (parseInt(text)) + 1
        if (onChange) onChange(v)
        setText(`${v} ${suffix}`)
    }

    const onDown = () => {
        let v = (parseInt(text)) - 1
        if (v < 0) v = 0
        if (onChange) onChange(v)
        setText(`${v} ${suffix}`)
    }

    return (
        <div className='inputfield'>
            <input ref={refInput} type="text" value={text} onFocus={onFocus} onBlur={onBlur} onChange={e=>onChangeValue(e.target.value)} placeholder={placeholder} style={style} />
            {(showButtons===undefined || showButtons===true) && (
                <>
                    <button onClick={onUp} className='up'>+</button>
                    <button onClick={onDown} className='down'>-</button>
                </>
            )}
        </div>
    )

}

const InputField =  {
    Number: NumberInput
}

export default InputField;