#!/usr/bin/python
"""
Apply content_render.xsl to a set of module_export_template files.
Pass the l10n-debug parameter with a true value, so that the l10n 
  keys are output with <xsl:message>.
Accumulate the keys, and output them to stdout in an XML format at the end.
Depends on lxml (http://codespeak.net/lxml/).
Expects module_export_template files to be in directories named for 
  the module ID, e.g.:

  m12818/module_export_template

Copyright 2009 Chuck Bearden and Connexions.
"""

import sys
import os
import re
from lxml import etree

usage = """
  %s </path/to/content_render.xsl> </path/to/mod_exp_temp>
""" % sys.argv[0]

if sys.argv[1] == '-h':
    print usage
    sys.exit()

xsltFname = sys.argv[1]
startDir = sys.argv[2]
l10nKeys = {}
xsltOpts = {'output-l10n-keys' : '1'}
printkeys = True
printkeys = False

transform = etree.XSLT(etree.parse(open(xsltFname)))
for dpath, dnames, fnames in os.walk(startDir):
    for fname in filter(lambda fname: fname == 'module_export_template', fnames):
        # print os.path.join(dpath, fname)
        result = transform(etree.parse(open(os.path.join(dpath, fname))), **xsltOpts)
        for msg in map(lambda msg: str(msg), filter(lambda msg: str(msg).find('l10n key') >= 0, transform.error_log)):
            startidx = msg.find('l10n key') + len('l10n key: ')
            l10nKey = msg[startidx:]
            if l10nKeys.has_key(l10nKey):
                l10nKeys[l10nKey] += 1
            else:
                l10nKeys[l10nKey] = 1
            if printkeys:
                print l10nKey

keys = map(lambda i: (i[1], i[0]), l10nKeys.items())
keys.sort()
keys.reverse()
print "<keys>"
for ct, key in keys:
    print "<key count='%d'>%s</key>" % (ct, key)
print "</keys>"
