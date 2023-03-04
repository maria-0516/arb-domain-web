import React from "react";
import './search.scss';
import arrow from '../assets/arb/img/down-arrow.svg';
import search_icon from '../assets/arb/img/search-icon.webp';
// import { isValidAddress } from "ethereumjs-util";
// import { validAddress } from "../lib/utils";

interface searchProps {
    showIcon?: boolean
    align?: 'center'
    value: string
    onChange(value: string): void 
    onSubmit(): void 
    
}

const langs = {
    EN: 'English (EN)', 
    CN: '简体中文 (CN)', 
    JA: '日本語 (JA)', 
    DE: 'Deutsch (DE)', 
    ES: 'Español (ES)', 
    FR: 'Français (FR)',
    KO: '한국어 (KO)',
    IT: 'Italiano (IT)', 
    PL: 'Polski (PL)', 
    BR: 'Português (BR)', 
    RU: 'Pусский (RU)', 
    VI: 'Tiếng Việt (VI)',
};
const SearchInput = React.forwardRef(({showIcon=true, value, align, onChange, onSubmit}: searchProps, ref: React.LegacyRef<HTMLInputElement>) => {
    const [lang, setLang] = React.useState('EN');
    
    const onChangeLang = (lng: string) => {
        setLang(lng);
    }

    return (
        <div className="search-input d-row">
            <img src={search_icon} width="50" height="43" alt="search" className={`search-img ${showIcon ? '' : 'hidden'}`} />
            <input ref={ref} type="text" className={`app-input ${showIcon ? '' : 'pl-0'}`} minLength={3} maxLength={42} placeholder="Search names or addresses" value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={e=>e.key==='Enter' && onSubmit()} />
            <input style={{display: 'none'}} type="checkbox" id="_check" />
            {/* <label htmlFor="_check"  className="input-btn d-row center middle">
                {lang}
                <img src={arrow} alt="arrow" className="arrow-img" />
            </label>
            <label htmlFor="_check" className="overlay"></label>
            <ul className={align}>
                {Object.keys(langs).map(i => (
                    <li key={i} className={`${lang===i ? 'active' : '' }`} onClick={() => onChangeLang(i)}>
                        <label htmlFor="_check">
                            {langs[i]}
                            <div className='radio'></div>
                        </label>
                    </li>
                ))}
            </ul> */}
        </div>
    )
});


export default SearchInput;