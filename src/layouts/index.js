import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import './all.sass';
import { graphql } from 'graphql/graphql';

const TemplateWrapper = ({ data, children }) => (
  <div>
    <Helmet title={data.site.frontmatter.title}>
    </Helmet>

    <header className="masthead bg-primary text-white text-center">
      <div className="container">
        <Link to="/"><img id="profile-pic" className="img-fluid mb-5 d-block mx-auto" src="/img/profile.jpg" alt="" /></Link>
        <h1 className="text-uppercase mb-0">{data.site.frontmatter.title}</h1>
        <hr className="star-light" />
        <h2 className="font-weight-light mb-0">{data.site.frontmatter.subtitle}</h2>
      </div>
    </header>
    
    <div>{children()}</div>

    <footer className="footer text-center">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-5 mb-lg-0">
            <h4 className="text-uppercase mb-4">About Mia</h4>
            <p className="lead mb-0">{data.site.frontmatter.summary}</p>
          </div>
          <div className="col-md-4 mb-5 mb-lg-0">
            <h4 className="text-uppercase mb-4">Email</h4>
            <p className="lead mb-0">{data.site.frontmatter.email}</p>
            <h4 className="text-uppercase mb-4 mt-4">Pages</h4>
            {data.site.frontmatter.links.map(link => <a href={link.url} key={link.url} className="lead mb-0">{link.name}</a>)}
          </div>
          <div className="col-md-4">
            <h4 className="text-uppercase mb-4">Software</h4>
            <div className="row">
              {data.site.frontmatter.software_list.map(software => <div className="col col-6 p-2 text-left" key={software.name}>
                {software.name}
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </footer>

    <div className="copyright py-4 text-center text-white">
      <div className="container">
        <small>Copyright &copy; {data.site.frontmatter.title} 2018</small>
      </div>
    </div>
  </div>
);

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
        filterTags {
          key
          description
        }
        interested_in
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
`