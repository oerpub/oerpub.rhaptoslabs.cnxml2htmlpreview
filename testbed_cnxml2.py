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

import glob
import os
import subprocess
import libxml2
import libxslt
from shutil import copy
from datetime import datetime
from cnxml2htmlpreview import cnxml_to_htmlpreview
#from htmlsoup2cnxml import htmlsoup_to_cnxml

TESTBED_INPUT_DIR = "testbed_cnx"  # the testbed folder
TESTBED_INPUT_FILEEXT = "*.*xml"
TESTBED_OUTPUT_DIR = "testbed_cnx_output"

CNXML2HTML_XSL = os.path.join('www', 'cnxml_render.xsl')

# prints a status message surrounded by some lines
def print_status(status_message):
    print '=' * 79
    print status_message
    print '=' * 79

def xsl_loadstylesheet():
    styleDoc1 = libxml2.parseFile(CNXML2HTML_XSL)
    style1 = libxslt.parseStylesheetDoc(styleDoc1)
    return style1

def xsl_transform(content, style1):
    # doc1 = libxml2.parseFile(afile))
    doc1 = libxml2.parseDoc(content)
    result1 = style1.applyStylesheet(doc1, None)
    #style1.saveResultToFilename(os.path.join('output', docFilename + '_meta.xml'), result1, 1)
    strResult1 = style1.saveResultToString(result1)
    #style1.freeStylesheet()
    doc1.freeDoc()
    result1.freeDoc()

    return strResult1

# copy the images from testbed input to testbed output
def copy_images():
    for jpeg_filename in glob.glob(os.path.join(TESTBED_INPUT_DIR, '*.jpg')):
        copy(jpeg_filename, os.path.join(TESTBED_OUTPUT_DIR, os.path.basename(jpeg_filename)))
    for png_filename in glob.glob(os.path.join(TESTBED_INPUT_DIR, '*.png')):
        copy(png_filename, os.path.join(TESTBED_OUTPUT_DIR, os.path.basename(png_filename)))
    for gif_filename in glob.glob(os.path.join(TESTBED_INPUT_DIR, '*.gif')):
        copy(gif_filename, os.path.join(TESTBED_OUTPUT_DIR, os.path.basename(gif_filename)))

# converts all matching files in testbed input folder to the output folder as HTML
def main():
    print str(datetime.now()) + ' (start time)'
    style = xsl_loadstylesheet()
    for cnx_filename in glob.glob(os.path.join(TESTBED_INPUT_DIR, TESTBED_INPUT_FILEEXT)):
        # output filename string preparation
        just_filename = os.path.basename(cnx_filename)
        just_filename_no_ext = os.path.splitext(just_filename)[0]
        html_filename = os.path.join(TESTBED_OUTPUT_DIR, just_filename_no_ext + '.htm')

        # read CNX testbed files
        cnx_file = open(cnx_filename)
        cnx = cnx_file.read()

        print_status('Transforming %s ...' % just_filename)

        # transform
        html = xsl_transform(cnx, style)
        #html = 'test123'

        # write testbed CNXML output
        html_file = open(html_filename, 'w')
        try:
            html_file.write(html)
            html_file.flush()
        finally:
            html_file.close()

    print_status('Copy images...')
    copy_images()

    print_status('Finished!')
    print str(datetime.now()) + ' (end time)'

if __name__ == "__main__":
    main()
