export default (id,tag,inHtml)=>{
    const element = document.createElement(tag);
    element.id = id;
    element.innerHTML = inHtml;
    return element;
}