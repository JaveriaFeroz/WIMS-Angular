insert into agpk_dbuat1.uat_ngwims.dbo.sku
(storerkey, sku, description, packkey, grossweight, netweight, cube, litre, skugroup)
select storerkey, sku, description, packkey, grossweight, netweight, cube, litre, skugroup from sku
where storerkey = 'PMCLTC001' and is10x = 1