import * as _ from 'lodash';

/**
 * Given a list of imagesharp nodes and a list of image contents, set the matching node to each content
 * @param {list} imageSharps A list of ImageSharp nodes
 * @param {list} imageContent A list of imageContents with image properties
 * @returns {list} A list of imageContents with matching images assigned to their "image" property 
 */
export function combineImagesharpWithContent(imageSharps, imageContent) {
    return imageContent
      .map(i => {
        var matchingImageSharp = _.find(imageSharps, imageSharp => new RegExp(i.image).test(_.get(imageSharp, 'id')));
        return {
          ...i,
          image: {
            sizes: _.get(matchingImageSharp, 'sizes'),
            src: _.get(matchingImageSharp, 'original.src')
          }
        }
      }).filter(i => i && i.image);
  }