MicroStrategy(R)
================================================================================
Your ESRI/Google map plugins are outdated. Since MicroStrategy 10.6, only one map plugin is needed for all map configuration. Your old map plugins have been migrated automatically to the new folder <connectorForMap>. All old files are backup up at BackupForOldPlugin.zip.
================================================================================
DETAILED CHANGES:
1. <plugin folder for ESRI>/WEB-INF/xml/config/esriConfig.xml and <plugin folder for Google>/WEB-INF/xml/config/google/googleConfig.xml are merged into one file: <connectorForMap>/WEB-INF/xml/config/mapConfig.xml.
2. <plugin folder for Google>/WEB-INF/xml/config/visualizations.xml is not needed anymore and is removed.
3.Plugin names in <plugin folder for ESRI>/WEB-INF/xml/config/esriConfig.xml and <plugin folder for ESRI>/WEB-INF/xml/config/mstrGeoShapesConfig.xml are replaced with new folder name.
4. All other files are copied to the new folder <connectorForMap>
================================================================================
If you find any issue related to this migration, you can also merge the map configurations manually based on the new map plugin structure. Please contact your administrator if you need any help.
