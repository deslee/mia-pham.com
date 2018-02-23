import React from "react";
import Link from "gatsby-link";
import Script from "react-load-script";
import graphql from "graphql";
import Img from 'gatsby-image';
import * as _ from 'lodash';
import { combineImagesharpWithContent } from '../utils/image-utils';

import { IndexPageTemplate } from './index-page';

export default class IndexPage extends React.Component {
  render() {
    const { data: { allMarkdownRemark, allImageSharp, site }, pathContext } = this.props;
    let remarkNodes = _.map(_.get(allMarkdownRemark, 'edges'), 'node');
    let sharpNodes = _.map(_.get(allImageSharp, 'edges'), 'node');

    var items = remarkNodes.map(n => n.frontmatter);

    // set the thumbnail of the item
    items = items.map(item => {
      let thumbnailId = _.get(item, 'thumbnail');

      if (!thumbnailId) return;
      
      var thumbnail = _.first(combineImagesharpWithContent(sharpNodes, [{ image: thumbnailId }]));

      if (!_.get(thumbnail, ['image', 'sizes'])) return;
      return {
        ...item,
        thumbnail: thumbnail
      }
    });

    return (
      <div>
        <IndexPageTemplate items={items} tags={site.frontmatter.filterTags} currentTag={pathContext.tag} />
      </div>
    );
  }
}

export const query = graphql`
  query TagQuery($tag: String!, $imageExp: String) {
    allMarkdownRemark(filter: {frontmatter: {tags: {eq: $tag}}}, sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          frontmatter {
            title
            big
            thumbnail
            templateKey
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
    allImageSharp(filter: {id: {regex: $imageExp}}) {
      edges {
        node {
          id
          sizes(maxWidth: 1920) {
            base64
            aspectRatio
            src
            srcSet
            sizes
          }
        }
      }
    }
    site: markdownRemark(frontmatter: {templateKey: {eq: "site-data"}}) {
      id
      frontmatter {
        title
        subtitle
        email
        summary
        filterTags {
          key
          description
        }
        links {
          name
          url
        }
        software_list {
          name
        }
      }
    }
  }
`;
