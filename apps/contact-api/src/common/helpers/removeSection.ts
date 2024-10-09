const removeSection = (html: string): string =>  {
    const regex = /<tr class="seccion-header-a">[\s\S]*?<\/tr>/;
    return html.replace(regex, '');
  };
export default removeSection;