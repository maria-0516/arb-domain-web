import React from 'react'
import Dialog from '../../../components/Dialog'
import { validAddress } from '../../../lib/utils'
import { validateEmail, validateUrl } from '../../../useStore'

interface InputDialogProps {
	format?: 'address'|'email'|'url'
	title: string
	placeholder?: string
	onClose(): void
	onSubmit(value: string): void
}

interface InputDialogStatus {
	value: string
	error: string
}

const InputDialog = ({title, format, onClose, placeholder, onSubmit}: InputDialogProps) => {
	const [status, setStatus] = React.useState<InputDialogStatus>({value: '', error: ''})
	const refInput = React.useRef<HTMLInputElement>(null)

	const onChange = (value: string) => {
		setStatus({...status, value, error: ''})
	}

	const onClick = () => {
		const {value} = status;
		if (format==='address' && !validAddress(value)) {
			return setStatus({...status, error: 'Please input a correct wallet address.'})
		} else if (format==='email' && !validateEmail(value)) {
			return setStatus({...status, error: 'Please input a correct email address.'})
		} else if (format==='url' && !validateUrl(value)) {
			return setStatus({...status, error: 'Please input a correct URL.'})
		}
		onSubmit(value)
		// setStatus({...status, value: '', error: ''})
	}

	return (
		<Dialog onClose={onClose}>
			<div className="input-dialog">
				<span style={{ textAlign: 'center' }}>{title}</span>
				<input ref={refInput} type="text" value={status.value} placeholder={placeholder} style={{textDecoration: (!!status.error ? 'line-through' : ''), color: (!!status.error ? 'red' : '')}} onChange={(e) => onChange(e.target.value)} onKeyDown={e=>e.key==="Enter" && onClick()} />
				{!!status.error && <span className="error-text">{status.error}</span>}
				<div className="d-row" style={{ gap: '1em' }}>
					<button className="btn outline" onClick={onClose}>CANCEL</button>
					<button className="btn" onClick={onClick}>OK</button>
				</div>
			</div>
		</Dialog>
	)
}

export default InputDialog