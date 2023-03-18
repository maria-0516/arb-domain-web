import React from 'react'
import { Link } from 'react-router-dom'
// import { Link } from 'react-router-dom'

import './paginator.scss'

interface PaginatorProps {
	page: number
	total: number
	getLink(n: number): string

	className?: string
}

const MAX_LINKS = 10;

const Paginator = ({page, total, getLink}: PaginatorProps) => {
	const [pages, setPages] = React.useState<number[]>([])

	React.useEffect(()=>{
		const _page = page < 1 ? 1 : page;
		const pos = Math.floor((_page - 1) / MAX_LINKS);
		const start = pos * MAX_LINKS
		let last = start + 10
		if (last > total) last = total;
		setPages(Array(last - start).fill(0).map((i, k)=>(k + start + 1)));
	}, [page, total])
	

	return (
		<div className='paginator'>
			{total > 1 && (
				<ul>
					{pages.map(k=>(<li key={k}><Link className={k===page ? 'selected' : ''} to={getLink(k)}>{k}</Link></li>))}
				</ul>
			)}
		</div>
		
	)
}

export default Paginator