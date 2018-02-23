import React from "react";
import Link from "gatsby-link";
import Script from "react-load-script";
import graphql from "graphql";
import Img from 'gatsby-image';
import * as _ from 'lodash';
import Masonry from 'react-masonry-component';
import { combineImagesharpWithContent } from '../utils/image-utils';

export const IndexPageTemplate = ({ items, tags, currentTag }) => {

  return (
    <section className="portfolio" id="portfolio">
          <div className="container">
            <h2 className="text-center text-uppercase text-secondary mb-0">Portfolio</h2>
            <hr className="star-dark mb-5" />

        <div className="row">
          <div className="col">
              <div className="text-center">
                <div className="btn-group d-none d-md-block grid-filter mb-2" role="group">
                   <Link to="/"><button type="button" className={`btn btn-light${currentTag ? '' : ' active'}`} data-filter="*">All</button></Link>
                    {tags.map(tag => (
                      <Link key={tag.key} to={`/tags/${tag.key}`} ><button type="button" className={`btn btn-light${currentTag === tag.key ? ' active': ''}`}>{tag.description}</button></Link>
                    ))}
                </div>

                <div className="btn-group d-md-none btn-group-vertical grid-filter mb-2 w-100" role="group">
                    <Link className="w-100" to="/"><button type="button" className={`btn btn-light${currentTag ? '' : ' active'}`} data-filter="*">All</button></Link>
                    {tags.map(tag => (
                      <Link className="w-100" key={tag.key} to={`/tags/${tag.key}`} ><button type="button" className={`btn btn-light${currentTag === tag.key ? ' active': ''}`}>{tag.description}</button></Link>
                    ))}
                </div>
              </div>
          </div>
        </div>

            <Masonry
                className={'grid'} // default ''
                elementType={'div'} // default 'div'
                options={{
                  transitionDuration: 0,
                  columnWidth: 10
                }} // default {}
                disableImagesLoaded={false} // default false
                updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
            >
                {items.map((item) => <div key={item.path} className={`grid-item${item.big ? ' grid-item--width2' : ''}`}>
                <Link className="portfolio-item" to={item.path}>
                  <div className="card">
                      <Img className="card-img-top" sizes={item.thumbnail.image.sizes} />
                      <div className="card-body d-none d-sm-block"> 
                        <p className="card-text">
                          {item.title}
                        </p>
                      </div>
                  </div>
                </Link>
              </div>)}
            </Masonry>
          </div>
        </section>
  )
}

export default class IndexPage extends React.Component {
  handleScriptLoad() {
    if (typeof window !== `undefined` && window.netlifyIdentity) {
      window.netlifyIdentity.on("init", user => {
        if (!user) {
          window.netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
          });
        }
      });
    }
    window.netlifyIdentity.init();
  }

  render() {
    const { data: { allMarkdownRemark, allImageSharp, site, postContext } } = this.props;
    let remarkNodes = _.map(_.get(allMarkdownRemark, 'edges', []), 'node').filter(n => n.frontmatter.templateKey === 'image-post');
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
        <Script
          url="https://identity.netlify.com/v1/netlify-identity-widget.js"
          onLoad={() => this.handleScriptLoad()}
        />
        
        <IndexPageTemplate items={items} tags={site.frontmatter.filterTags} />
      </div>
    );
  }
}

export const query = graphql`
  query IndexQuery($imageExp: String) {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          frontmatter {
            templateKey
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
