<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:l="http://docbook.sourceforge.net/xmlns/l10n/1.0"
                xmlns:exsl="http://exslt.org/common"
                xmlns:str="http://exslt.org/strings"
                extension-element-prefixes="exsl str"
>

  <xsl:output indent="yes" method="xml"/>
  <xsl:strip-space elements="*"/>
  <xsl:variable name="keys-doc" select="document('keys.xml')"/>
  <xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyzäëïöüáéíóúàèìòùâêîôûåøãõæœçłñ'"/>
  <xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZÄËÏÖÜÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÅØÃÕÆŒÇŁÑ'"/>

  <xsl:template match="xsl:with-param[@name='key']" mode="keys-doc">
    <key>
      <xsl:choose>
        <xsl:when test="@select"><xsl:value-of select="@select"/></xsl:when>
        <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
      </xsl:choose>
    </key>
  </xsl:template>

  <xsl:template match="l:i18n">
    <xsl:copy>
      <xsl:comment>This file is generated automatically.</xsl:comment>
      <xsl:comment>1.  Use mkL10nKeys.py to create an XML file containing the key </xsl:comment>
      <xsl:comment>    values passed to gentext calls over a body of Connexions content:</xsl:comment>
      <xsl:comment>      ./mkL10nKeys.py /path/to/content_render.xsl /path/to/module_export_template/files > keys.xml</xsl:comment>
      <xsl:comment>2.  Use buildl10n.xsl to extract those keys from the Docbook l10n.xml </xsl:comment>
      <xsl:comment>    file that are used in Connexions content:</xsl:comment>
      <xsl:comment>      xsltproc buildl10n.xsl /usr/share/xml/docbook/stylesheet/nwalsh/common/l10n.xml > l10n.xml</xsl:comment>
      <xsl:comment>    Note that the keys.xml file from step 1 must be in the same directory </xsl:comment>
      <xsl:comment>    as the buildl10n.xsl stylesheet.</xsl:comment>
      <xsl:comment>Copyright 2009 Chuck Bearden and Connexions.</xsl:comment>
      <xsl:apply-templates select="@*|node()"/>
      <!--<xsl:copy-of select="$keys-doc-rtf"/>-->
    </xsl:copy>
  </xsl:template>

  <xsl:template match="l:l10n">
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:apply-templates select="l:gentext"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="l:gentext">
    <xsl:if test="@key = $keys-doc/keys/key">
      <xsl:copy>
        <xsl:apply-templates select="@*|node()"/>
      </xsl:copy>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template match="*">
  </xsl:template>
  
  <xsl:template match="@*|text()|comment()|processing-instruction()">
    <xsl:copy/>
  </xsl:template>
  
</xsl:stylesheet>
