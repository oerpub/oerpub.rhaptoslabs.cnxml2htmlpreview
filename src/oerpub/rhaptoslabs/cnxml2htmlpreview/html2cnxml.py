"""
Author: Izak Burger
Copyright (C) 2012 Katherine Fletcher.
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
"""

import sys
import os
import libxml2
import libxslt
from pkg_resources import resource_filename

XSL = resource_filename('rhaptos.cnxmlutils', 'xsl/html5-to-cnxml.xsl')

# Main method. Doing all steps for the back-transformation
def xsl_transform(content):
    # XSLT transformation
    doc = libxml2.parseFile(XSL)
    style = libxslt.parseStylesheetDoc(doc)
    doc2 = libxml2.parseDoc(content)
    result = style.applyStylesheet(doc2, None)
    strResult = style.saveResultToString(result)
    style.freeStylesheet()
    doc2.freeDoc()
    result.freeDoc()
    return strResult

def html_to_cnxml(content):
    if isinstance(content, unicode):
        # libxml2 wants utf-8
        content = content.encode('UTF-8')
    return xsl_transform(content)

if __name__ == "__main__":
    print html_to_cnxml(open(sys.argv[1], 'r').read())
