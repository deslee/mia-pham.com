import React from 'react';
import graphql from 'graphql';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import Content, { HTMLContent } from '../components/Content';
import Img from 'gatsby-image';
import * as _ from 'lodash';
import Lightbox from 'react-image-lightbox';
import { combineImagesharpWithContent } from '../utils/image-utils';

export class ImagePostTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }

  openLightbox(i) {
    this.setState({
      photoIndex: 0,
      isOpen: true
    })
  }

  render() {
    const { title, images, content, contentComponent, helmet } = this.props;
    const PageContent = contentComponent || Content;
    const { photoIndex, isOpen } = this.state;
  
    return (
      <div className="container text-center p-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
          { helmet || ''}
          <h2 className="text-secondary text-uppercase mb-0">{title}</h2> 
          <hr className="star-dark mb-5" />
  
          <PageContent className="mb-5" content={content}/>
          { images.map((i, key) => 
          <div key={key}>
            <a onClick={(e) => {this.openLightbox(key); e.preventDefault()}} target="_blank" rel="noopener noreferrer" href={i.image.src}><Img sizes={i.image.sizes} /></a><br />{i.description}
          </div>
          ) }
  
          <Link className="btn btn-primary btn-lg rounded-pill" to="/">
                    <i className="fa fa-close"></i>
                    Home</Link>
          </div>
        </div>
        
        {/* lightbox */}
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex].image.src}
            nextSrc={images[(photoIndex + 1) % images.length].image.src}
            prevSrc={images[(photoIndex + images.length - 1) % images.length].image.src}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        )}
      </div>
    );
  }
}

export default ({ data, pathContext }) => {
  const { markdownRemark: post, allImageSharp } = data;
  var imageSharps = _.get(allImageSharp, ['edges'], []).map(e => e.node);
  // get a list of images from the post
  var images = combineImagesharpWithContent(imageSharps, _.get(post, ['frontmatter', 'images'], []));

  return (<ImagePostTemplate
    contentComponent={HTMLContent}
    title={post.frontmatter.title}
    images={images}
    content={post.html}
    helmet={<Helmet title={`${post.frontmatter.title}`} />}
  />);
};

export const ImagePostQuery = graphql`
  query imagePostByPath($path: String!, $imageExp: String) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
        thumbnail
        images {
            description
            image
        }
      }
    }
    allImageSharp(filter: {id: {regex: $imageExp}}) {
      edges {
        node {
          id
          original {
            src
          }
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
  }
`;