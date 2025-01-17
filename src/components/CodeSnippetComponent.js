import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { QueriesStore, UserStore } from '../store/queriesStore'
import RawCodeMirror from './bitqueditor/components/RawCodeMirror'
import copy from 'copy-to-clipboard'
import { useToasts } from 'react-toast-notifications'
import { getCodeSnippet } from '../api/api'
import { languageList } from '../utils/snippetLanguageList'

const CodeSnippetComponent = observer(function CodeSnippetComponent() {

	const { currentQuery: { endpoint_url, query, variables } } = QueriesStore
	const { user } = UserStore
	const { addToast } = useToasts()

	const [language, setLanguage] = useState(
		{
			"key": "curl",
			"label": "cURL",
			"syntax_mode": "powershell",
			"variant": "cURL"
		}
	)
	const [snippet, setSnippet] = useState('')

	const handleCopy = () => {
		copy(snippet)
		addToast('Copied to clipboard', {appearance: 'success'})
	}

	const main = async () => {
		if (!user) return
		const body = {
			language, query, variables, endpoint_url, key: user.key
		}
		const { data : { snippet } } = await getCodeSnippet(body)
		setSnippet(snippet)
	}

	useEffect(() => {
		main()
	}, [language, user, query, variables, endpoint_url])

	return (
		<section className='codesnippet__root'>
			<div className="doc-explorer-title-bar">
				<div className="doc-explorer-title">Code snippet</div>
			</div>
			<div className="options flex">
				<div className="navbar-collapse mr-auto" id="navbarCodeSnippet">
					<ul className={'navbar-nav mr-auto'}>
						<li className="nav-item dropdown">
							<a 	className="nav-link dropdown-toggle" 
								href="# "
								id="navbarDropdown" 
								role="button" 
								data-toggle="dropdown" 
								aria-haspopup="true" 
								aria-expanded="false"
							>
								{ `${language.label}` } { language.variant !== language.label && ` - ${language.variant}` }
							</a>
							<div className="dropdown-menu" disabled>
								{languageList.map(item => item.variants.map(( { key }, i ) => (
									<a  className="dropdown-item" href="# " key={key} onClick={() => setLanguage({...item, variant: key})}>
										{ item.label } { key !== item.key && ` - ${key}` }
									</a>
								)))}
							</div>
						</li>
					</ul>
				</div>
				<div className="buttons">
					<i className="bi bi-back" onClick={handleCopy} />
				</div>
			</div>
			<div className='card'>
				<RawCodeMirror mode={language.syntax_mode} value={snippet}/>
			</div>
		</section>
	)
})

export default CodeSnippetComponent