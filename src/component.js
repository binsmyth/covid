export default (id,tag,inHtml)=>{
    const element = document.createElement(tag);
    element.id = id;
    if (inHtml !== undefined) {
        element.innerHTML = inHtml;
    }
    return element;
}