'''
Author: Marvin Reimer
Copyright (C) 2011 Katherine Fletcher.
Funding was provided by The Shuttleworth Foundation as part of the
OER Roadmap Project.

If the license this software is distributed under is not suitable
for your purposes, you may contact the copyright holder through
oer-roadmap-discuss@googlegroups.com to discuss different licensing
terms.

This file is part of oerpub.rhaptoslabs.cnxml2htmlpreview

oerpub.rhaptoslabs.cnxml2htmlpreview is free software: you can
redistribute it and/or modify it under the terms of the GNU Lesser
General Public License as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.

oerpub.rhaptoslabs.cnxml2htmlpreview is distributed in the hope that it
will be useful, but WITHOUT ANY WARRANTY; without even the implied
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with oerpub.rhaptoslabs.cnxml2htmlpreview.
If not, see <http://www.gnu.org/licenses/>.
'''

import sys
import os
#import urllib2
#from urlparse import urlparse
#import subprocess
#from Globals import package_home
import libxml2
import libxslt
#from lxml import etree
#import magic
from pkg_resources import resource_filename

#XHTML_ENTITIES = os.path.join('www', 'catalog_xhtml', 'catalog.xml')
current_dir = os.path.dirname(__file__)
CNXML2HTML_XSL = resource_filename('rhaptos.cnxmlutils', 'xsl/cnxml-to-html5.xsl')

# Main method. Doing all steps for the HTMLSOUP to CNXML transformation
def xsl_transform(content):
    # XSLT transformation
    styleDoc1 = libxml2.parseFile(CNXML2HTML_XSL)
    style1 = libxslt.parseStylesheetDoc(styleDoc1)
    # doc1 = libxml2.parseFile(afile))
    doc1 = libxml2.parseDoc(content)
    result1 = style1.applyStylesheet(doc1, None)
    #style1.saveResultToFilename(os.path.join('output', docFilename + '_meta.xml'), result1, 1)
    strResult1 = style1.saveResultToString(result1)
    style1.freeStylesheet()
    doc1.freeDoc()
    result1.freeDoc()

    return strResult1

def cnxml_to_htmlpreview(content):
    content = xsl_transform(content)
    return content

if __name__ == "__main__":
    f = open(sys.argv[1])
    content = f.read()
    print cnxml_to_htmlpreview(content)
