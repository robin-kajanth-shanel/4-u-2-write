import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register font
Font.register({ family: 'Josefin Sans', src: `http://fonts.gstatic.com/s/josefinsans/v9/xgzbb53t8j-Mo-vYa23n5onF5uFdDttMLvmWuJdhhgs.ttf` });
Font.register({ family: 'Lato', src: `http://fonts.gstatic.com/s/lato/v13/v0SdcGFAl2aezM9Vq_aFTQ.ttf` });

// Create styles for PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingTop: 40,
        paddingLeft: 70,
        paddingRight: 70,
        paddingBottom: 40
    },
    section: {
        margin: 10,
        flexGrow: 1
    },
    title: {
        fontSize: 45,
        fontFamily: 'Josefin Sans',
        fontWeight: 'bold',
        color: 'black',
        margin: 10,
        marginBottom: 30,
        textAlign: 'center' 
    },
    bodyText: {
        fontSize: 15,
        fontFamily: 'Lato',
        fontWeight: 'light',
        color: 'black',
        margin: 10,
        textAlign: "left",
        lineHeight: 1.5,
    }
});

// Create Document Component
const PDFExport = (props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={[styles.title]}>{props.title}</Text>
                <Text style={[styles.bodyText]}>{props.message}</Text>
                
            </View>
        </Page>
    </Document>
);

export default PDFExport;