import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Img from 'gatsby-image';
import Link from 'gatsby-link';
import "bootstrap/scss/bootstrap.scss";
import './all.sass';
import { graphql } from 'graphql/graphql';
import { combineImagesharpWithContent } from '../utils/image-utils';

const TemplateWrapper = ({ data, children }) => {
 
  const { allImageSharp, site: { frontmatter: { title, subtitle, summary, email, links, software_list, profile_image } } } = data;
  let sharpNodes = _.map(_.get(allImageSharp, 'edges'), 'node');
  var logo = _.first(combineImagesharpWithContent(sharpNodes, [{ image: profile_image }]));
  let logoSizes = _.get(logo, 'image.sizes');

  return (
    <div>
      <Helmet title={title}>
        <link href={profile_image} rel="icon" />
      </Helmet>
  
      <header className="masthead bg-primary text-white text-center">
        <div className="container">
          <Link to="/">
            <Img className="profile-pic mb-5 d-block mx-auto" sizes={logoSizes} />
          </Link>
          <h1 className="text-uppercase mb-0">{title}</h1>
          <hr className="star-light" />
          <h2 className="font-weight-light mb-0">{subtitle}</h2>
        </div>
      </header>
      
      <div>{children()}</div>
  
      <footer className="footer text-center">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-5 mb-lg-0">
              <h4 className="text-uppercase mb-4">About Mia</h4>
              <p className="lead mb-0">{summary}</p>
            </div>
            <div className="col-md-4 mb-5 mb-lg-0">
              <h4 className="text-uppercase mb-4">Email</h4>
              <p className="lead mb-0">{email}</p>
              <h4 className="text-uppercase mb-4 mt-4">Pages</h4>
              {links.map(link => <a href={link.url} key={link.url} className="lead mb-0">{link.name}</a>)}
            </div>
            <div className="col-md-4">
              <h4 className="text-uppercase mb-4">Software</h4>
              <div className="row">
                {software_list.map(software => <div className="col col-6 p-2 text-center" key={software.name}>
                  {software.name}
                </div>)}
              </div>
            </div>
          </div>
        </div>
      </footer>
  
      <div className="copyright py-4 text-center text-white">
        <div className="container">
          <small>Copyright &copy; {title} 2018</small>
        </div>
      </div>
    </div>
  );
  
};

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;

export const query = graphql`
  query LayoutQuery {
    site: markdownRemark(frontmatter: {templateKey: {eq: "site-data"}}) {
      id
      frontmatter {
        title
        subtitle
        email
        summary
        profile_image
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
    allImageSharp {
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
`