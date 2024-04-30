import React, {useEffect,useState,useRef} from 'react'
import { AsyncTypeahead,Menu} from 'react-bootstrap-typeahead';
import CatalogSearchResult from './CatalogSearchResult';


const CatalogCartSearch =(props)=> {
    const [searchedText, setSearchedText] = useState('');
    const productSearchInputRef = useRef();
    const [showCancelButton, setShowCancelButton] = useState(false);
    
    useEffect(() => {
        setShowCancelButton(searchedText.length > 0);
    }, [searchedText]);
    
    const clearSearchResultAndText = () => {
        setSearchedText('');
        productSearchInputRef.current.clear();
    }
    
    return (
        <form className="form-inline w-100">
            <div className="input-group col p-0 catalog-search">
                {!showCancelButton && <button className="p-0 border-0 search-icons pointer" disabled role="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g id="Search_black_icon_24px" transform="translate(-48.941 -105.819)"><rect id="Rectangle_3285" data-name="Rectangle 3285" width="24" height="24" transform="translate(48.941 105.819)" fill="none"></rect><path id="Path_22916" data-name="Path 22916" d="M72.711,128.457l-7.162-7.132a9.455,9.455,0,1,0-1.1,1.1l7.164,7.133a.78.78,0,1,0,1.1-1.1ZM50.5,115.262a7.853,7.853,0,1,1,7.853,7.853A7.862,7.862,0,0,1,50.5,115.262Z" fill="#000000"></path></g></svg>
</button>}
                { showCancelButton && <button className="p-0 border-0 search-icons pointer opacity-50" onClick={() => clearSearchResultAndText()} >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                    <g id="close_black_icon_24px" transform="translate(-48.941 -281.937)">
                        <rect id="Rectangle_3290" data-name="Rectangle 3290" width="18" height="18" transform="translate(48.941 281.937)" fill="none"/>
                        <path id="Path_1951" data-name="Path 1951" d="M72.622,304.007,62.517,293.924,72.6,283.84a1.108,1.108,0,0,0-1.567-1.566L60.945,292.356l-10.083-10.1a1.109,1.109,0,0,0-1.567,1.568l10.083,10.1L49.295,304.007a1.108,1.108,0,1,0,1.509,1.624c.02-.018.039-.037.058-.057L60.945,295.49l10.084,10.084a1.108,1.108,0,0,0,1.566,0h0a1.09,1.09,0,0,0,.052-1.541Z" fill="#000000"/>
                    </g>
                    </svg></button>}
                 <AsyncTypeahead
                    delay={500}
                    id="CatalogCartSearch"
                    filterBy={() => true}
                    minLength={3}
                    maxResults={100}
                    ref={productSearchInputRef}
                    useCache={false}
                    onInputChange = {(text) => {
                        setSearchedText(text);
                    }}
                    onChange = {(selectedLocality) => {}}
                    onSearch={(text) => {console.log("Searching..... : ", text);}}
                    clearButton
                    positionFixed={true}
                    value={searchedText}
                    placeholder={"Search for...Pharmacy Products"}
                    inputProps={{ className: 'w-100' }}
                    renderMenu={()=>{
                        return(
                            <React.Fragment>
                                <Menu id="CatalogCartSearch" className='w-100 shadow-sm'>
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <CatalogSearchResult key={item} />
                                ))}
                                    {/* <CatalogSearchResult></CatalogSearchResult> */}
                                </Menu>
                            </React.Fragment>
                            )
                    }
                        
                    }
                >
                 </AsyncTypeahead>
    </div>
    </form>

    )
}

export default CatalogCartSearch