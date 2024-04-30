import React, { useRef, useState } from 'react'
import { AsyncTypeahead, Menu } from 'react-bootstrap-typeahead';
import Validate from '../../helpers/Validate';
import IndividualSearchSuggestion from '../Catalog/ProductSearch/SearchSuggestion/IndividualSearchSuggestion';
const TestSearchSuggestion = (props) => {
    const productSearchInputRef = useRef();
    const [searchedText, setSearchedText] = useState('');
    const [showCancelButton, setShowCancelButton] = useState(false)
    const validate = Validate();
    const suggestions = [
        {
            productName:"MDX Anemia"
        },
        {
            productName:"3T MRI" 
        },
        {
            productName:"Blood Glucode Fasting"
        },
        {
            productName:"CBP"
        },
        {
            productName:"Hemoglobin"
        }
]
    const loading = props.loading;
  return (
    <form className="form-inline w-100">
            <div className="position-relative col p-0 catalog-search">
                {!showCancelButton && !loading && <button className="p-0 border-0 search-icons pointer" disabled role="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g id="Search_black_icon_24px" transform="translate(-48.941 -105.819)"><rect id="Rectangle_3285" data-name="Rectangle 3285" width="24" height="24" transform="translate(48.941 105.819)" fill="none"></rect><path id="Path_22916" data-name="Path 22916" d="M72.711,128.457l-7.162-7.132a9.455,9.455,0,1,0-1.1,1.1l7.164,7.133a.78.78,0,1,0,1.1-1.1ZM50.5,115.262a7.853,7.853,0,1,1,7.853,7.853A7.862,7.862,0,0,1,50.5,115.262Z" fill="#6c757d"></path></g></svg>
                    </button>}
                {showCancelButton && <button className="p-0 border-0 search-icons pointer" onClick={() => clearSearchResultAndText()} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <g id="close_black_icon_24px" transform="translate(-48.941 -281.937)">
                            <rect id="Rectangle_3290" data-name="Rectangle 3290" width="18" height="18" transform="translate(48.941 281.937)" fill="none"/>
                            <path id="Path_1951" data-name="Path 1951" d="M72.622,304.007,62.517,293.924,72.6,283.84a1.108,1.108,0,0,0-1.567-1.566L60.945,292.356l-10.083-10.1a1.109,1.109,0,0,0-1.567,1.568l10.083,10.1L49.295,304.007a1.108,1.108,0,1,0,1.509,1.624c.02-.018.039-.037.058-.057L60.945,295.49l10.084,10.084a1.108,1.108,0,0,0,1.566,0h0a1.09,1.09,0,0,0,.052-1.541Z" fill="#6c757d"/>
                        </g>
                    </svg>
                </button>}
                 <AsyncTypeahead
                    delay={500}
                    id="CatalogCartSearch"
                    filterBy={() => true}
                    minLength={3}
                    maxResults={100}
                    isLoading={loading}
                    ref={productSearchInputRef}
                    labelKey={(suggestion) => validate.isNotEmpty(suggestion.productName) ? `${suggestion.productName}` : `${suggestion.compositionName_s}`}
                    useCache={false}
                    clearButton
                    positionFixed={true}
                    onKeyDown={event => {
                        if (event.key === 'Enter' && validate.isNotEmpty(event.target.value) && validate.isNotEmpty(event.target.value.trim()) && event.target.value.length >= 3) {
                            setSearchedText(event.target.value)
                        }
                    }}
                    onInputChange={(text) => {
                        setSearchedText(text);
                        setShowCancelButton(text?.length > 0 && !loading ? true : false);
                    }}
                    onSearch={props?.getSuggestions}
                    value={searchedText}
                    placeholder={"Search for ... Lab Tests"}
                    inputProps={{ className: 'w-100' }}
                    options={suggestions}
                    renderMenu={(suggestions) => {
                        return (
                            <div className='custom-search-dropdown'>
                                <Menu id="CatalogCartSearchResult" className='w-100 shadow-sm'>
                                    {loading && <div className="dropdown-item disabled">Searching...</div>}
                                    {!loading && validate.isNotEmpty(suggestions) && suggestions.map((eachSuggestedProduct, index) => (
                                        <IndividualSearchSuggestion isLastProduct={index == (suggestions.length - 1)} eachProduct={eachSuggestedProduct} />
                                    ))}
                                    {!loading && validate.isEmpty(suggestions) && <div className="dropdown-item disabled">No Tests Found</div>}
                                </Menu>
                            </div>
                        )
                    }}
                >
                 </AsyncTypeahead>
    </div>
    </form>
  )
}

export default TestSearchSuggestion